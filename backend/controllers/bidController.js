const { v4: uuidv4 } = require('uuid');
const { Bid, Tender, User, Organisation, Sequelize } = require('../models');
const { Op } = Sequelize;

// Utility function to generate bid number (modify as per your requirements)
const generateBidNumber = () => {
  return `BID-${Math.floor(1000 + Math.random() * 9000)}-${Date.now()}`;
};

// Get all bids
exports.getAllBids = async (req, res) => {
  try {
    const bids = await Bid.findAll();
    res.status(200).json(bids);
  } catch (error) {
    console.error('Error fetching bids:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

// Create Bid
exports.createBid = async (req, res) => {
  try {
    const newBid = await Bid.create({
      id: uuidv4(),
      bidNumber: generateBidNumber(),
      ...req.body,
    });
    res.status(201).json(newBid);
  } catch (error) {
    console.error('Error creating bid:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a single bid by ID
exports.getBidById = async (req, res) => {
  try {
    const { id } = req.params;
    const bid = await Bid.findByPk(id, {
      include: [
        {
          model: Tender,
          as: 'tender',
          attributes: ['id', 'title', 'category', 'budget'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone'],
        },
      ],
    });
    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found',
      });
    }
    res.status(200).json({
      success: true,
      data: bid,
    });
  } catch (error) {
    console.error('Error fetching bid:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Update a bid by ID
exports.updateBid = async (req, res) => {
  try {
    const { id } = req.params;
    const bid = await Bid.findByPk(id);
    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found',
      });
    }
    await bid.update({
      ...req.body,
      updatedAt: new Date(),
    });
    const updatedBid = await Bid.findByPk(id, {
      include: [
        {
          model: Tender,
          as: 'tender',
          attributes: ['id', 'title', 'category', 'budget'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone'],
        },
      ],
    });
    res.status(200).json({
      success: true,
      message: 'Bid updated successfully',
      data: updatedBid,
    });
  } catch (error) {
    console.error('Error updating bid:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Get bids by user ID
exports.getBidsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const bids = await Bid.findAll({
      where: { userId },
      include: [
        {
          model: Tender,
          as: 'tender',
          attributes: ['id', 'title', 'category', 'budget'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({
      success: true,
      data: bids,
      count: bids.length,
    });
  } catch (error) {
    console.error('Error fetching bids by user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Delete a bid by ID
exports.deleteBid = async (req, res) => {
  try {
    const { id } = req.params;
    const bid = await Bid.findByPk(id);
    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found',
      });
    }
    await bid.destroy();
    res.status(200).json({
      success: true,
      message: 'Bid deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting bid:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Get received bids
exports.getReceivedBids = async (req, res) => {
  try {
    const { organisationId } = req.params; // or get from JWT token
    const receivedBids = await Bid.findAll({
      include: [
        {
          model: Tender,
          as: 'tender',
          where: {
            organisationId: organisationId,
          },
          attributes: [
            'id',
            'title',
            'description',
            'category',
            'budget',
            'deadline',
            'requirements',
            'location',
            'status',
          ],
          include: [
            {
              model: Organisation,
              as: 'organisation',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      data: receivedBids,
      count: receivedBids.length,
    });
  } catch (error) {
    console.error('Error fetching received bids:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Get received bids statistics for dashboard
exports.getReceivedBidsStats = async (req, res) => {
  try {
    const { organisationId } = req.params;
    const stats = await Bid.findAll({
      include: [
        {
          model: Tender,
          as: 'tender',
          where: {
            organisationId: organisationId,
          },
          attributes: [],
        },
      ],
      attributes: [
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('Bid.id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    const formattedStats = {
      total: 0,
      pending: 0,
      under_review: 0,
      accepted: 0,
      rejected: 0,
    };

    stats.forEach(stat => {
      formattedStats[stat.status] = parseInt(stat.count);
      formattedStats.total += parseInt(stat.count);
    });

    return res.status(200).json({
      success: true,
      data: formattedStats,
    });
  } catch (error) {
    console.error('Error fetching received bids stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Update bid status
exports.updateBidStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, evaluatedBy } = req.body;

    const validStatuses = ['pending', 'under_review', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', '),
      });
    }

    const bid = await Bid.findByPk(id);
    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found',
      });
    }

    const updateData = {
      status,
      updatedBy: evaluatedBy,
      updatedAt: new Date(),
    };

    if (notes) {
      updateData.notes = notes;
    }

    if (status === 'under_review' || status === 'accepted' || status === 'rejected') {
      updateData.reviewedAt = new Date();
      updateData.evaluatedBy = evaluatedBy;
    }

    await bid.update(updateData);

    const updatedBid = await Bid.findByPk(id, {
      include: [
        {
          model: Tender,
          as: 'tender',
          attributes: ['id', 'title', 'category'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: `Bid ${status.replace('_', ' ')} successfully`,
      data: updatedBid,
    });
  } catch (error) {
    console.error('Error updating bid status:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Evaluate bid with scores
exports.evaluateBid = async (req, res) => {
  try {
    const { id } = req.params;
    const { technicalScore, financialScore, notes, evaluatedBy } = req.body;

    if (technicalScore < 0 || technicalScore > 100 || financialScore < 0 || financialScore > 100) {
      return res.status(400).json({
        success: false,
        message: 'Scores must be between 0 and 100',
      });
    }

    const bid = await Bid.findByPk(id);
    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found',
      });
    }

    const totalScore = (technicalScore * 0.6) + (financialScore * 0.4);

    await bid.update({
      technicalScore,
      financialScore,
      totalScore: Math.round(totalScore * 100) / 100,
      status: 'under_review',
      reviewedAt: new Date(),
      evaluatedBy,
      notes: notes || bid.notes,
      updatedAt: new Date(),
    });

    const updatedBid = await Bid.findByPk(id, {
      include: [
        {
          model: Tender,
          as: 'tender',
          attributes: ['id', 'title', 'category'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: 'Bid evaluated successfully',
      data: updatedBid,
    });
  } catch (error) {
    console.error('Error evaluating bid:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Get bids for a specific tender
exports.getBidsByTender = async (req, res) => {
  try {
    const { tenderId } = req.params;

    const bids = await Bid.findAll({
      where: { tenderId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone'],
        },
        {
          model: Tender,
          as: 'tender',
          attributes: ['id', 'title', 'category', 'budget'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      data: bids,
      count: bids.length,
    });
  } catch (error) {
    console.error('Error fetching bids by tender:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Export bids to CSV
exports.exportReceivedBids = async (req, res) => {
  try {
    const { organisationId } = req.params;
    const { format = 'csv' } = req.query;

    const receivedBids = await Bid.findAll({
      include: [
        {
          model: Tender,
          as: 'tender',
          where: {
            organisationId: organisationId,
          },
          attributes: ['title', 'category', 'budget'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email', 'phone'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    if (format === 'csv') {
      const csvData = receivedBids.map(bid => ({
        'Bid Number': bid.bidNumber,
        'Tender Title': bid.tender.title,
        'Category': bid.tender.category,
        'Bidder Company': bid.companyName,
        'Bidder Email': bid.user.email,
        'Bid Amount': bid.amount,
        'Currency': bid.currency,
        'Status': bid.status,
        'Technical Score': bid.technicalScore || 'Not Evaluated',
        'Financial Score': bid.financialScore || 'Not Evaluated',
        'Total Score': bid.totalScore || 'Not Evaluated',
        'Submitted At': bid.submittedAt,
        'Proposed Timeline': bid.proposedTimeline,
        'Team Size': bid.teamSize,
      }));

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=received-bids.csv');

      const headers = Object.keys(csvData[0] || {});
      const csvContent = [
        headers.join(','),
        ...csvData.map(row =>
          headers.map(header => JSON.stringify(row[header] || '')).join(',')
        ),
      ].join('\n');

      return res.send(csvContent);
    }

    return res.status(400).json({
      success: false,
      message: 'Unsupported export format',
    });
  } catch (error) {
    console.error('Error exporting received bids:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Search and filter received bids
exports.searchReceivedBids = async (req, res) => {
  try {
    const { organisationId } = req.params;
    const {
      search,
      status,
      tenderId,
      minAmount,
      maxAmount,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
    } = req.query;

    const whereConditions = {};
    const tenderWhereConditions = {
      organisationId: organisationId,
    };

    if (search) {
      whereConditions[Op.or] = [
        { bidNumber: { [Op.iLike]: `%${search}%` } },
        { companyName: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (status) {
      whereConditions.status = status;
    }

    if (tenderId) {
      whereConditions.tenderId = tenderId;
    }

    if (minAmount || maxAmount) {
      whereConditions.amount = {};
      if (minAmount) whereConditions.amount[Op.gte] = minAmount;
      if (maxAmount) whereConditions.amount[Op.lte] = maxAmount;
    }

    if (dateFrom || dateTo) {
      whereConditions.submittedAt = {};
      if (dateFrom) whereConditions.submittedAt[Op.gte] = new Date(dateFrom);
      if (dateTo) whereConditions.submittedAt[Op.lte] = new Date(dateTo);
    }

    const offset = (page - 1) * limit;

    const { count, rows: bids } = await Bid.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Tender,
          as: 'tender',
          where: tenderWhereConditions,
          attributes: ['id', 'title', 'category', 'budget'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: offset,
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      success: true,
      data: bids,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error searching received bids:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};