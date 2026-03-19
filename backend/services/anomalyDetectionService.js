const { AnomalyFlag, Bid, BidEvaluation } = require('../models');
const { Op } = require('sequelize');

// ─── STATISTICAL HELPERS ──────────────────────────────────────────────────────
function mean(arr)   { return arr.reduce((a, b) => a + b, 0) / arr.length; }
function stdDev(arr) {
  const m = mean(arr);
  return Math.sqrt(arr.reduce((sum, v) => sum + Math.pow(v - m, 2), 0) / arr.length);
}
function zScore(value, arr) {
  const sd = stdDev(arr);
  return sd === 0 ? 0 : (value - mean(arr)) / sd;
}
function iqrBounds(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  return { lower: q1 - 1.5 * iqr, upper: q3 + 1.5 * iqr };
}

// ─── DETECTION RULES ──────────────────────────────────────────────────────────

// 1. Price outlier: z-score > 2.5 or outside IQR
async function detectPriceOutliers(tenderId, bids) {
  const flags = [];
  if (bids.length < 3) return flags; // need min 3 bids for stats

  const amounts = bids.map(b => b.bidAmount);
  const { lower, upper } = iqrBounds(amounts);

  for (const bid of bids) {
    const z = zScore(bid.bidAmount, amounts);
    const isOutlier = Math.abs(z) > 2.5 || bid.bidAmount < lower || bid.bidAmount > upper;

    if (isOutlier) {
      const severity = Math.abs(z) > 3.5 ? 'high' : 'medium';
      flags.push({
        tenderId, bidId: bid.id, bidderId: bid.bidderId,
        flagType: bid.bidAmount < lower ? 'below_cost_bid' : 'price_outlier',
        severity,
        description: `Bid amount $${bid.bidAmount} has z-score of ${z.toFixed(2)}. Mean: $${mean(amounts).toFixed(0)}, SD: $${stdDev(amounts).toFixed(0)}`,
        statisticalValue: +z.toFixed(4),
        threshold: 2.5,
        detectionMethod: 'z-score + IQR'
      });
    }
  }
  return flags;
}

// 2. Duplicate bids: same bidder submits multiple bids
async function detectDuplicateBids(tenderId, bids) {
  const flags = [];
  const bidderMap = {};

  for (const bid of bids) {
    if (!bidderMap[bid.bidderId]) bidderMap[bid.bidderId] = [];
    bidderMap[bid.bidderId].push(bid);
  }

  for (const [bidderId, bidderBids] of Object.entries(bidderMap)) {
    if (bidderBids.length > 1) {
      flags.push({
        tenderId, bidderId: +bidderId,
        bidId: bidderBids[0].id,
        flagType: 'duplicate_bid',
        severity: 'high',
        description: `Bidder submitted ${bidderBids.length} bids for the same tender`,
        statisticalValue: bidderBids.length,
        threshold: 1,
        detectionMethod: 'rule'
      });
    }
  }
  return flags;
}

// 3. Last-minute bid pattern: submitted in final 5% of time window
async function detectDeadlineManipulation(tenderId, bids, tender) {
  const flags = [];
  const windowMs = new Date(tender.deadline) - new Date(tender.publishedAt);
  const threshold = new Date(tender.deadline) - windowMs * 0.05; // last 5%

  for (const bid of bids) {
    if (new Date(bid.submittedAt) >= threshold) {
      flags.push({
        tenderId, bidId: bid.id, bidderId: bid.bidderId,
        flagType: 'deadline_manipulation',
        severity: 'low',
        description: `Bid submitted in final 5% of tender window (${bid.submittedAt})`,
        statisticalValue: new Date(tender.deadline) - new Date(bid.submittedAt),
        threshold: windowMs * 0.05,
        detectionMethod: 'rule'
      });
    }
  }
  return flags;
}

// 4. Bid rotation: same bidder wins disproportionately in a category
async function detectBidRotation(bidderId, category) {
  const recentWins = await BidEvaluation.count({
    where: { bidderId, rank: 1, status: 'awarded' },
    include: [{ model: require('../models').Tender, where: { category }, required: true }]
  });

  const totalInCategory = await BidEvaluation.count({
    where: { rank: 1, status: 'awarded' },
    include: [{ model: require('../models').Tender, where: { category }, required: true }]
  });

  if (totalInCategory > 5) {
    const winRate = recentWins / totalInCategory;
    if (winRate > 0.4) { // winning >40% of contracts in a category is suspicious
      return {
        bidderId,
        flagType: 'bid_rotation',
        severity: winRate > 0.6 ? 'critical' : 'high',
        description: `Bidder wins ${(winRate * 100).toFixed(0)}% of contracts in category '${category}'`,
        statisticalValue: +winRate.toFixed(4),
        threshold: 0.4,
        detectionMethod: 'statistical'
      };
    }
  }
  return null;
}

// ─── MAIN RUNNER ──────────────────────────────────────────────────────────────
async function runAnomalyDetection(tenderId) {
  const { Tender, Bid } = require('../models');
  const tender = await Tender.findByPk(tenderId);
  const bids   = await Bid.findAll({ where: { tenderId } });

  if (!tender || bids.length === 0) return [];

  const allFlags = [
    ...await detectPriceOutliers(tenderId, bids),
    ...await detectDuplicateBids(tenderId, bids),
    ...await detectDeadlineManipulation(tenderId, bids, tender)
  ];

  // Save flags to DB (avoid duplicate flags for same bid+type)
  const saved = [];
  for (const flag of allFlags) {
    const [record, created] = await AnomalyFlag.findOrCreate({
      where: { tenderId: flag.tenderId, bidId: flag.bidId, flagType: flag.flagType },
      defaults: flag
    });
    saved.push(record);
  }

  return saved;
}

module.exports = { runAnomalyDetection, detectBidRotation };