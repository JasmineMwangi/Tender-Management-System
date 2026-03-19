const { BidEvaluation, Bid, Tender, User } = require('../models');

// ─── WEIGHTS (must sum to 1.0) ───────────────────────────────────────────────
const DEFAULT_WEIGHTS = {
  price:      0.35,
  quality:    0.25,
  timeline:   0.20,
  experience: 0.15,
  compliance: 0.05
};

// ─── RULE-BASED MANDATORY CHECKS ─────────────────────────────────────────────
function runMandatoryChecks(bid, tender) {
  const failures = [];

  // Rule 1: Bid must be submitted before deadline
  if (new Date(bid.submittedAt) > new Date(tender.deadline)) {
    failures.push('Bid submitted after deadline');
  }

  // Rule 2: Bid amount must not exceed tender budget by >20%
  if (bid.bidAmount > tender.budget * 1.2) {
    failures.push(`Bid amount $${bid.bidAmount} exceeds budget threshold`);
  }

  // Rule 3: Required documents must be present
  const requiredDocs = tender.requiredDocuments || [];
  const submittedDocs = bid.submittedDocuments || [];
  const missingDocs = requiredDocs.filter(d => !submittedDocs.includes(d));
  if (missingDocs.length > 0) {
    failures.push(`Missing documents: ${missingDocs.join(', ')}`);
  }

  // Rule 4: Bidder must have minimum experience years
  if (tender.minExperienceYears && bid.bidder?.experienceYears < tender.minExperienceYears) {
    failures.push(`Bidder has ${bid.bidder.experienceYears} yrs experience; minimum is ${tender.minExperienceYears}`);
  }

  // Rule 5: Bidder must not be blacklisted
  if (bid.bidder?.isBlacklisted) {
    failures.push('Bidder is blacklisted');
  }

  return { passed: failures.length === 0, reasons: failures };
}

// ─── SCORING FUNCTIONS (return 0–10) ─────────────────────────────────────────

// Price score: lowest bid gets 10, others scored proportionally
function calcPriceScore(bidAmount, allBidAmounts) {
  const min = Math.min(...allBidAmounts);
  if (bidAmount <= 0) return 0;
  // Score = (min / bidAmount) * 10 — lower price = higher score
  return Math.min(10, (min / bidAmount) * 10);
}

// Quality: passed in directly (from evaluation rubric 0–10)
function calcQualityScore(qualityRating) {
  return Math.max(0, Math.min(10, qualityRating));
}

// Timeline: fewer days = better (relative to tender duration)
function calcTimelineScore(proposedDays, tenderDays) {
  if (proposedDays <= 0) return 0;
  const ratio = tenderDays / proposedDays;
  return Math.min(10, ratio * 10);
}

// Experience: scale 0–10 based on years, capped at 20 years = 10
function calcExperienceScore(experienceYears) {
  return Math.min(10, (experienceYears / 20) * 10);
}

// Compliance: % of requirements met * 10
function calcComplianceScore(metRequirements, totalRequirements) {
  if (totalRequirements === 0) return 10;
  return (metRequirements / totalRequirements) * 10;
}

// ─── MAIN EVALUATION FUNCTION ─────────────────────────────────────────────────
async function evaluateBidsForTender(tenderId, weights = DEFAULT_WEIGHTS) {
  const tender = await Tender.findByPk(tenderId, { include: ['bids'] });
  if (!tender) throw new Error('Tender not found');

  const bids = tender.bids;
  if (bids.length === 0) return [];

  const allBidAmounts = bids.map(b => b.bidAmount);

  const results = [];

  for (const bid of bids) {
    // Step 1: Mandatory checks (disqualify if fail)
    const mandatory = runMandatoryChecks(bid, tender);

    if (!mandatory.passed) {
      results.push({
        bidId: bid.id,
        bidderId: bid.bidderId,
        passesMandatoryChecks: false,
        disqualificationReason: mandatory.reasons.join('; '),
        totalScore: 0
      });
      continue;
    }

    // Step 2: Calculate individual scores
    const priceScore      = calcPriceScore(bid.bidAmount, allBidAmounts);
    const qualityScore    = calcQualityScore(bid.qualityRating);
    const timelineScore   = calcTimelineScore(bid.proposedDays, tender.estimatedDays);
    const experienceScore = calcExperienceScore(bid.bidder?.experienceYears || 0);
    const complianceScore = calcComplianceScore(bid.metRequirements || 0, (tender.requiredDocuments || []).length);

    // Step 3: Weighted total
    const totalScore =
      priceScore      * weights.price      +
      qualityScore    * weights.quality    +
      timelineScore   * weights.timeline   +
      experienceScore * weights.experience +
      complianceScore * weights.compliance;

    results.push({
      bidId: bid.id,
      bidderId: bid.bidderId,
      tenderId,
      priceScore:      +priceScore.toFixed(2),
      qualityScore:    +qualityScore.toFixed(2),
      timelineScore:   +timelineScore.toFixed(2),
      experienceScore: +experienceScore.toFixed(2),
      complianceScore: +complianceScore.toFixed(2),
      totalScore:      +totalScore.toFixed(2),
      passesMandatoryChecks: true,
      status: 'evaluated',
      evaluatedAt: new Date()
    });
  }

  // Step 4: Rank qualified bids
  const qualified = results.filter(r => r.passesMandatoryChecks);
  qualified.sort((a, b) => b.totalScore - a.totalScore);
  qualified.forEach((r, i) => { r.rank = i + 1; });

  // Step 5: Upsert into DB
  for (const result of results) {
    await BidEvaluation.upsert(result);
  }

  return results;
}

module.exports = { evaluateBidsForTender, DEFAULT_WEIGHTS };