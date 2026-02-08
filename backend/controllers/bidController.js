const { v4: uuidv4 } = require('uuid');
const { Bid, Tender, User, Organization, Sequelize } = require('../models');
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

// Add these methods to your existing bidController.js

// Get bid history for a specific user (bidder)
exports.getBidHistory = async (req, res) => {
  try {
    const { userId } = req.user.id;
    //where: { userId }
    const {
      page = 1,
      limit = 10,
      status = 'all',
      category = 'all',
      dateFrom,
      dateTo,
      sortBy = 'submittedAt',
      sortOrder = 'desc'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereConditions = { userId };

    // Add status filter
    if (status !== 'all') {
      whereConditions.status = status;
    }

    // Add date range filter
    if (dateFrom || dateTo) {
      whereConditions.submittedAt = {};
      if (dateFrom) whereConditions.submittedAt[Op.gte] = new Date(dateFrom);
      if (dateTo) whereConditions.submittedAt[Op.lte] = new Date(dateTo);
    }

    // Tender category filter
    const tenderWhere = {};
    if (category !== 'all') {
      tenderWhere.category = category;
    }

    const { count, rows: bidHistory } = await Bid.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Tender,
          as: 'tender',
          where: Object.keys(tenderWhere).length ? tenderWhere : undefined,
          attributes: [
            'id', 'title', 'description', 'category', 'budget',
            'deadline', 'status', 'location', 'requirements'
          ],
          include: [
            {
              model: Organization,
              as: 'organization',
              attributes: ['id', 'name', 'email', 'phone']
            }
          ]
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: offset
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      success: true,
      data: bidHistory,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching bid history:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

// Get bid history statistics for dashboard
exports.getBidHistoryStats = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get overall statistics
    const totalBids = await Bid.count({ where: { userId } });

    const statusStats = await Bid.findAll({
      where: { userId },
      attributes: [
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Get success rate (accepted bids / total bids)
    const acceptedBids = await Bid.count({
      where: { userId, status: 'accepted' }
    });
    const successRate = totalBids > 0 ? ((acceptedBids / totalBids) * 100).toFixed(1) : 0;

    // Get average bid amount
    const avgBidAmount = await Bid.findOne({
      where: { userId },
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('amount')), 'avgAmount']
      ],
      raw: true
    });

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivity = await Bid.count({
      where: {
        userId,
        submittedAt: { [Op.gte]: thirtyDaysAgo }
      }
    });

    // Format status statistics
    const formattedStats = {
      total: totalBids,
      submitted: 0,
      reviewed: 0,
      qualified: 0,
      rejected: 0,
      awarded: 0,
      successRate: parseFloat(successRate),
      avgBidAmount: parseFloat(avgBidAmount?.avgAmount || 0),
      recentActivity
    };

    statusStats.forEach(stat => {
      if (formattedStats.hasOwnProperty(stat.status)) {
        formattedStats[stat.status] = parseInt(stat.count);
      }
    });

    return res.status(200).json({
      success: true,
      data: formattedStats
    });
  } catch (error) {
    console.error('Error fetching bid history stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

// Get detailed bid information by ID (for bidder view)
exports.getBidDetailsForBidder = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query; // Ensure bidder can only see their own bids

    const bid = await Bid.findOne({
      where: { id, userId }, // Security check
      include: [
        {
          model: Tender,
          as: 'tender',
          attributes: [
            'id', 'title', 'description', 'category', 'budget',
            'deadline', 'status', 'location', 'requirements', 'createdAt'
          ],
          include: [
            {
              model: Organization,
              as: 'organization',
              attributes: ['id', 'name', 'email', 'phone', 'website']
            }
          ]
        }
      ]
    });

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found or access denied'
      });
    }

    return res.status(200).json({
      success: true,
      data: bid
    });
  } catch (error) {
    console.error('Error fetching bid details:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

// Withdraw a pending bid
exports.withdrawBid = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, reason } = req.body;

    const bid = await Bid.findOne({
      where: { id, userId } // Security check
    });

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found or access denied'
      });
    }

    // Check if bid can be withdrawn (only pending bids)
    if (bid.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending bids can be withdrawn'
      });
    }

    // Update bid status to withdrawn
    await bid.update({
      status: 'withdrawn',
      withdrawnAt: new Date(),
      withdrawalReason: reason || 'Withdrawn by bidder',
      updatedAt: new Date()
    });

    return res.status(200).json({
      success: true,
      message: 'Bid withdrawn successfully',
      data: bid
    });
  } catch (error) {
    console.error('Error withdrawing bid:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

// Get bid timeline/activity log
exports.getBidTimeline = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const bid = await Bid.findOne({
      where: { id, userId },
      include: [
        {
          model: Tender,
          as: 'tender',
          attributes: ['title']
        }
      ]
    });

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found or access denied'
      });
    }

    // Create timeline events
    const timeline = [
      {
        id: 1,
        event: 'Bid Submitted',
        description: `Your bid of ${new Intl.NumberFormat('en-KE', { style: 'currency', currency: bid.currency || 'KES' }).format(bid.amount)} was submitted`,
        timestamp: bid.submittedAt,
        status: 'completed',
        icon: 'send'
      }
    ];

    if (bid.reviewedAt) {
      timeline.push({
        id: 2,
        event: 'Under Review',
        description: 'Your bid is being evaluated by the organization',
        timestamp: bid.reviewedAt,
        status: bid.status === 'under_review' ? 'current' : 'completed',
        icon: 'eye'
      });
    }

    if (bid.status === 'accepted') {
      timeline.push({
        id: 3,
        event: 'Bid Accepted',
        description: 'Congratulations! Your bid has been accepted',
        timestamp: bid.updatedAt,
        status: 'completed',
        icon: 'check-circle'
      });
    } else if (bid.status === 'rejected') {
      timeline.push({
        id: 3,
        event: 'Bid Rejected',
        description: 'Unfortunately, your bid was not selected',
        timestamp: bid.updatedAt,
        status: 'completed',
        icon: 'x-circle'
      });
    } else if (bid.status === 'withdrawn') {
      timeline.push({
        id: 3,
        event: 'Bid Withdrawn',
        description: bid.withdrawalReason || 'Bid was withdrawn',
        timestamp: bid.withdrawnAt,
        status: 'completed',
        icon: 'arrow-left'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        bid: bid,
        timeline: timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      }
    });
  } catch (error) {
    console.error('Error fetching bid timeline:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
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
// Get bids for a specific tender for organization
exports.getReceivedBids = async (req, res) => {
  console.log('🎯 getReceivedBids function CALLED');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);

  try {
    // ✅ Allow organization and admin
    if (!['organization', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    console.log('Searching for bids for organization:', req.user.id);

    const bids = await Bid.findAll({
      include: [
        {
          model: Tender,
          as: 'tender',
          where: { organizationId: req.user.id }, // only tenders owned by logged in org
          attributes: ['id', 'title', 'category'],
        },
        {
          model: User,
          as: 'user', // matches Bid.js alias
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log('Found bids:', bids.length);
    res.json({ success: true, data: bids });
  } catch (error) {
    console.error('❌ Error in getReceivedBids:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
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

  
// Get received bids statistics for dashboard
exports.getReceivedBidsStats = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const stats = await Bid.findAll({
      include: [
        {
          model: Tender,
          as: 'tender',
          where: {
            organisazionId: organisazionId,
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
    const { organizationId } = req.params;
    const { format = 'csv' } = req.query;

    const receivedBids = await Bid.findAll({
      include: [
        {
          model: Tender,
          as: 'tender',
          where: {
            organizationId: organizationId,
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
    const { organizationId } = req.params;
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
      organizationId: organizationId,
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