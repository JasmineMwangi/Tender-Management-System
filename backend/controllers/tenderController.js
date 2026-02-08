const { Tender, User } = require('../models'); // adjust path if needed
const { Op } = require('sequelize');

// Create a new tender
exports.createTender = async (req, res) => {
  try {
    const tender = await Tender.create(req.body);
    return res.status(201).json(tender);
  } catch (err) {
    console.error('❌ Tender creation error:', err);

    // Handle Sequelize validation errors
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: err.errors.map(e => e.message)
      });
    }

    // Generic fallback
    return res.status(500).json({
      error: 'Failed to create tender',
      details: err.message || 'Unknown error'
    });
  }
};



// exports.createTender = async (req, res) => {
//   try {
//     const tender = await tender.create(req.body);
//     return res.status(201).json(tender);
//   } catch (err) {
//     console.error(err);
//     return res.status(400).json({ error: 'Failed to create tender', details: err });
//   }
// };

// Get all tenders (optional filters: search, status)


exports.getAllTenders = async (req, res) => {
  try {
    const { search, status } = req.query;

    const where = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { category: { [Op.like]: `%${search}%` } }
      ];
    }

    const tenders = await Tender.findAll({
      where,
      include: [
        {
          model: User,
          as: 'organization',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(tenders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch tenders', details: err.message });
  }
};





// exports.getAllTenders = async (req, res) => {
//   try {
//     const { search, status } = req.query;

//     const where = {};
//     if (status && status !== 'all') where.status = status;

//     if (search) {
//       where[Op.or] = [
//         { title: { [Op.iLike]: `%${search}%` } },
//         { description: { [Op.iLike]: `%${search}%` } },
//         { category: { [Op.iLike]: `%${search}%` } }
//       ];
//     }

//     const tenders = await tender.findAll({ where, order: [['createdAt', 'DESC']] });
//     return res.status(200).json(tenders);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Failed to fetch tenders' });
//   }
// };

// Get single tender by ID
exports.getTenderById = async (req, res) => {
  try {
    const { id } = req.params;
    const tender = await Tender.findByPk(id);
    if (!tender) return res.status(404).json({ error: 'Tender not found' });
    return res.status(200).json(tender);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch tender' });
  }
};

// Update a tender
exports.updateTender = async (req, res) => {
  try {
    const tender = await Tender.findByPk(req.params.id);
    if (!tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }

    await tender.update(req.body);
    return res.status(200).json(tender);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update tender' });
  }
};

// Delete a tender
exports.deleteTender = async (req, res) => {
  try {
    const tender = await Tender.findByPk(req.params.id);
    if (!tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }

    await tender.destroy();
    return res.status(200).json({ message: 'Tender deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to delete tender' });
  }
};

