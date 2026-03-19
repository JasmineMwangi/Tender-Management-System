'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    try {

      // ── Fetch all submitted bids with amounts ─────────────────────────
      const [bids] = await queryInterface.sequelize.query(`
        SELECT id, userId, tenderId, amount, technicalScore, financialScore, totalScore
        FROM bids
        WHERE deletedAt IS NULL
        ORDER BY createdAt ASC;
      `);
      if (!bids.length) throw new Error('❌ No bids found. Seed bids first.');

      // ── Group bids by tender ──────────────────────────────────────────
      const byTender = {};
      for (const bid of bids) {
        if (!byTender[bid.tenderId]) byTender[bid.tenderId] = [];
        byTender[bid.tenderId].push(bid);
      }

      // ── Scoring helpers ───────────────────────────────────────────────
      const minVal = arr => Math.min(...arr);

      function calcPriceScore(amount, allAmounts) {
        return Math.min(10, (minVal(allAmounts) / amount) * 10);
      }
      function calcQualityScore(technicalScore) {
        // technicalScore is 0–100, convert to 0–10
        return Math.min(10, (parseFloat(technicalScore) || 70) / 10);
      }
      function calcTimelineScore(proposedTimeline) {
        // Extract number from string like "175 days"
        const days = parseInt(proposedTimeline) || 120;
        return Math.min(10, (150 / days) * 10);
      }
      function calcFinancialScore(financialScore) {
        return Math.min(10, (parseFloat(financialScore) || 70) / 10);
      }

      const weights = {
        price:    0.35,
        quality:  0.25,
        timeline: 0.20,
        financial:0.15,
        compliance: 0.05
      };

      // ── Build evaluation rows ─────────────────────────────────────────
      const evaluations = [];

      for (const [tenderId, tenderBids] of Object.entries(byTender)) {
        const allAmounts = tenderBids.map(b => parseFloat(b.amount));

        const scored = tenderBids.map(bid => {
          const priceScore    = calcPriceScore(parseFloat(bid.amount), allAmounts);
          const qualityScore  = calcQualityScore(bid.technicalScore);
          const timelineScore = calcTimelineScore(bid.proposedTimeline);
          const financialScore= calcFinancialScore(bid.financialScore);
          const complianceScore = 8.0; // default since no metRequirements column

          const totalScore =
            priceScore     * weights.price      +
            qualityScore   * weights.quality    +
            timelineScore  * weights.timeline   +
            financialScore * weights.financial  +
            complianceScore* weights.compliance;

          return {
            bid,
            priceScore:      +priceScore.toFixed(2),
            qualityScore:    +qualityScore.toFixed(2),
            timelineScore:   +timelineScore.toFixed(2),
            experienceScore: +financialScore.toFixed(2), // mapped to experienceScore column
            complianceScore: +complianceScore.toFixed(2),
            totalScore:      +totalScore.toFixed(2),
          };
        });

        // Rank highest score first
        scored.sort((a, b) => b.totalScore - a.totalScore);

        scored.forEach((s, i) => {
          evaluations.push({
            id:          uuidv4(),
            tenderId:    s.bid.tenderId,
            bidId:       s.bid.id,
            bidderId:    s.bid.userId,
            priceScore:      s.priceScore,
            qualityScore:    s.qualityScore,
            timelineScore:   s.timelineScore,
            experienceScore: s.experienceScore,
            complianceScore: s.complianceScore,
            totalScore:      s.totalScore,
            passesMandatoryChecks:  true,
            disqualificationReason: null,
            rank:        i + 1,
            status:      'evaluated',
            evaluatedAt: new Date(),
            evaluatedBy: null,
            createdAt:   new Date(),
            updatedAt:   new Date(),
          });
        });
      }

      await queryInterface.bulkInsert('BidEvaluations', evaluations, {});
      console.log(`✅ BidEvaluations seeded — ${evaluations.length} rows`);

    } catch (err) {
      console.error('❌ BidEvaluations seeder failed:', err.message);
      throw err;
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('BidEvaluations', null, {});
  }
};