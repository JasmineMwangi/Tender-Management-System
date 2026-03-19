'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    try {

      // ── Fetch org user ────────────────────────────────────────────────
      const [orgUser] = await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE role = 'organization' LIMIT 1;`
      );
      if (!orgUser.length) throw new Error('❌ No organisation user found. Seed users first.');

      // ── Fetch all bidders ─────────────────────────────────────────────
      const [bidders] = await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE role = 'bidder' ORDER BY createdAt ASC;`
      );
      if (bidders.length < 5) throw new Error('❌ Not enough bidders. Run seed-bidder-profiles first.');

      const orgId = orgUser[0].id;
      const now   = new Date();

      // ── Pre-generate tender IDs so bids can reference them ────────────
      const t1 = uuidv4(); // Highway Bridge      — has anomalies
      const t2 = uuidv4(); // Water Treatment
      const t3 = uuidv4(); // Solar Installation
      const t4 = uuidv4(); // IT System Upgrade
      const t5 = uuidv4(); // School Renovation
      const t6 = uuidv4(); // Mombasa Port Road   — awarded (history)
      const t7 = uuidv4(); // Kisumu Water Supply — awarded (history)

      // ── Insert tenders — only columns that exist in your tenders table ─
      await queryInterface.bulkInsert('tenders', [
        {
          id: t1,
          organizationId: orgId,
          title: 'Highway Bridge Construction',
          description: 'Design and construction of a dual-carriageway highway bridge.',
          category: 'Infrastructure',
          budget: 2500000.00,
          deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          requirements: 'Min 8 years experience. Must provide performance bond.',
          contactEmail: 'transport@gov.ke',
          contactPhone: '+254700100001',
          location: 'Nairobi',
          status: 'published',
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
        },
        {
          id: t2,
          organizationId: orgId,
          title: 'City Water Treatment Plant',
          description: 'Construction of a modern water treatment facility.',
          category: 'Water',
          budget: 1800000.00,
          deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
          requirements: 'Must have completed similar water projects.',
          contactEmail: 'water@county.ke',
          contactPhone: '+254700100002',
          location: 'Nairobi',
          status: 'published',
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
        },
        {
          id: t3,
          organizationId: orgId,
          title: 'Solar Panel Installation',
          description: 'Supply and installation of 500kW solar panels for county offices.',
          category: 'Green Energy',
          budget: 1200000.00,
          deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          requirements: 'Must be certified solar installer.',
          contactEmail: 'energy@county.ke',
          contactPhone: '+254700100003',
          location: 'Nairobi',
          status: 'published',
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
        },
        {
          id: t4,
          organizationId: orgId,
          title: 'Hospital IT System Upgrade',
          description: 'Upgrade of hospital management information system.',
          category: 'IT Services',
          budget: 900000.00,
          deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
          requirements: 'Must have healthcare IT experience.',
          contactEmail: 'health@gov.ke',
          contactPhone: '+254700100004',
          location: 'Mombasa',
          status: 'published',
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
        },
        {
          id: t5,
          organizationId: orgId,
          title: 'School Renovation Project',
          description: 'Renovation of 3 primary schools including classrooms and ablution blocks.',
          category: 'Education',
          budget: 600000.00,
          deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
          requirements: 'Experience in school construction preferred.',
          contactEmail: 'education@county.ke',
          contactPhone: '+254700100005',
          location: 'Kisumu',
          status: 'published',
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
        },
        {
          id: t6,
          organizationId: orgId,
          title: 'Mombasa Port Road Expansion',
          description: 'Expansion of access roads to Mombasa port.',
          category: 'Infrastructure',
          budget: 4000000.00,
          deadline: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          requirements: 'Min 10 years infrastructure experience.',
          contactEmail: 'transport@gov.ke',
          contactPhone: '+254700100006',
          location: 'Mombasa',
          status: 'closed',
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
        },
        {
          id: t7,
          organizationId: orgId,
          title: 'Kisumu Water Supply Network',
          description: 'Extension of water supply network to 3 new estates.',
          category: 'Water',
          budget: 2200000.00,
          deadline: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          requirements: 'Must have completed municipal water projects.',
          contactEmail: 'water@kisumu.ke',
          contactPhone: '+254700100007',
          location: 'Kisumu',
          status: 'closed',
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
        },
      ], {});

      console.log('✅ Tenders seeded successfully');

      // ── Anomaly timing: last 3% of t1 window ─────────────────────────
      const t1Deadline  = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
      const t1Published = new Date(Date.now() - 5  * 24 * 60 * 60 * 1000);
      const windowMs    = t1Deadline - t1Published;
      const lastMinute  = new Date(t1Deadline - windowMs * 0.03);

      // ── Insert bids — only columns that exist in your bids table ──────
      await queryInterface.bulkInsert('bids', [

        // ── Tender 1: Highway Bridge — 5 bids ──
        {
          id: uuidv4(), userId: bidders[0].id, tenderId: t1,
          bidNumber: 'BID-T1-001', amount: 2400000,
          proposedTimeline: '175 days', companyName: 'Constructa Ltd',
          technicalScore: 92.0, financialScore: 88.0, totalScore: 90.0,
          status: 'submitted', type: 'combined',
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          createdAt: now, updatedAt: now, deletedAt: null,
        },
        {
          id: uuidv4(), userId: bidders[1].id, tenderId: t1,
          bidNumber: 'BID-T1-002', amount: 2550000,
          proposedTimeline: '160 days', companyName: 'BuildTech Solutions',
          technicalScore: 88.0, financialScore: 82.0, totalScore: 85.0,
          status: 'submitted', type: 'combined',
          submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          createdAt: now, updatedAt: now, deletedAt: null,
        },
        {
          id: uuidv4(), userId: bidders[2].id, tenderId: t1,
          bidNumber: 'BID-T1-003', amount: 2480000,
          proposedTimeline: '170 days', companyName: 'InfraCo Kenya',
          technicalScore: 90.0, financialScore: 85.0, totalScore: 87.5,
          status: 'submitted', type: 'combined',
          submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          createdAt: now, updatedAt: now, deletedAt: null,
        },
        {
          id: uuidv4(), userId: bidders[3].id, tenderId: t1,
          bidNumber: 'BID-T1-004', amount: 2600000,
          proposedTimeline: '190 days', companyName: 'Metro Builders',
          technicalScore: 75.0, financialScore: 80.0, totalScore: 77.5,
          status: 'submitted', type: 'combined',
          submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          createdAt: now, updatedAt: now, deletedAt: null,
        },
        // ⚠️ ANOMALY: below_cost_bid + deadline_manipulation
        {
          id: uuidv4(), userId: bidders[4].id, tenderId: t1,
          bidNumber: 'BID-T1-005', amount: 800000,
          proposedTimeline: '180 days', companyName: 'Green Energy Co',
          technicalScore: 60.0, financialScore: 55.0, totalScore: 57.5,
          status: 'submitted', type: 'combined',
          submittedAt: lastMinute,  // ⚠️ last 3% of window
          createdAt: now, updatedAt: now, deletedAt: null,
        },

        // ── Tender 2: Water Treatment — 5 bids ──
        {
          id: uuidv4(), userId: bidders[0].id, tenderId: t2,
          bidNumber: 'BID-T2-001', amount: 1750000,
          proposedTimeline: '115 days', companyName: 'Constructa Ltd',
          technicalScore: 85.0, financialScore: 88.0, totalScore: 86.5,
          status: 'submitted', type: 'combined',
          submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          createdAt: now, updatedAt: now, deletedAt: null,
        },
        {
          id: uuidv4(), userId: bidders[1].id, tenderId: t2,
          bidNumber: 'BID-T2-002', amount: 1820000,
          proposedTimeline: '120 days', companyName: 'BuildTech Solutions',
          technicalScore: 91.0, financialScore: 84.0, totalScore: 87.5,
          status: 'submitted', type: 'combined',
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          createdAt: now, updatedAt: now, deletedAt: null,
        },
        {
          id: uuidv4(), userId: bidders[2].id, tenderId: t2,
          bidNumber: 'BID-T2-003', amount: 1900000,
          proposedTimeline: '130 days', companyName: 'InfraCo Kenya',
          technicalScore: 78.0, financialScore: 80.0, totalScore: 79.0,
          status: 'submitted', type: 'combined',
          submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          createdAt: now, updatedAt: now, deletedAt: null,
        },
        {
          id: uuidv4(), userId: bidders[3].id, tenderId: t2,
          bidNumber: 'BID-T2-004', amount: 1780000,
          proposedTimeline: '110 days', companyName: 'Metro Builders',
          technicalScore: 89.0, financialScore: 86.0, totalScore: 87.5,
          status: 'submitted', type: 'combined',
          submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          createdAt: now, updatedAt: now, deletedAt: null,
        },
        {
          id: uuidv4(), userId: bidders[4].id, tenderId: t2,
          bidNumber: 'BID-T2-005', amount: 1850000,
          proposedTimeline: '125 days', companyName: 'Green Energy Co',
          technicalScore: 82.0, financialScore: 83.0, totalScore: 82.5,
          status: 'submitted', type: 'combined',
          submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          createdAt: now, updatedAt: now, deletedAt: null,
        },

        // ── Tender 3: Solar Installation — 5 bids ──
        {
          id: uuidv4(), userId: bidders[0].id, tenderId: t3,
          bidNumber: 'BID-T3-001', amount: 1150000,
          proposedTimeline: '85 days', companyName: 'Constructa Ltd',
          technicalScore: 80.0, financialScore: 82.0, totalScore: 81.0,
          status: 'submitted', type: 'combined',
          submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          createdAt: now, updatedAt: now, deletedAt: null,
        },
        {
          id: uuidv4(), userId: bidders[1].id, tenderId: t3,
          bidNumber: 'BID-T3-002', amount: 1200000,
          proposedTimeline: '90 days', companyName: 'BuildTech Solutions',
          technicalScore: 85.0, financialScore: 79.0, totalScore: 82.0,
          status: 'submitted', type: 'combined',
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          createdAt: now, updatedAt: now, deletedAt: null,
        },
        {
          id: uuidv4(), userId: bidders[2].id, tenderId: t3,
          bidNumber: 'BID-T3-003', amount: 1180000,
          proposedTimeline: '88 days', companyName: 'InfraCo Kenya',
          technicalScore: 90.0, financialScore: 83.0, totalScore: 86.5,
          status: 'submitted', type: 'combined',
          submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          createdAt: now, updatedAt: now, deletedAt: null,
        },
        {
          id: uuidv4(), userId: bidders[3].id, tenderId: t3,
          bidNumber: 'BID-T3-004', amount: 1250000,
          proposedTimeline: '95 days', companyName: 'Metro Builders',
          technicalScore: 75.0, financialScore: 76.0, totalScore: 75.5,
          status: 'submitted', type: 'combined',
          submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          createdAt: now, updatedAt: now, deletedAt: null,
        },
        {
          id: uuidv4(), userId: bidders[4].id, tenderId: t3,
          bidNumber: 'BID-T3-005', amount: 1170000,
          proposedTimeline: '80 days', companyName: 'Green Energy Co',
          technicalScore: 88.0, financialScore: 85.0, totalScore: 86.5,
          status: 'submitted', type: 'combined',
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          createdAt: now, updatedAt: now, deletedAt: null,
        },

      ], {});

      console.log('✅ Bids seeded successfully');
    } catch (err) {
      console.error('❌ Demo tenders/bids seeder failed:', err.message);
      throw err;
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('bids',    null, {});
    await queryInterface.bulkDelete('tenders', null, {});
  }
};