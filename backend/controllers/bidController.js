// Import all required models
const { Bid, Tender, User, Organisation } = require('../models');
const { v4: uuidv4 } = require('uuid');

// Auto-generate a unique bid number
const generateBidNumber = () => {
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BID-${timestamp}-${random}`;
};

// Create Bid
exports.createBid = async (req, res) => {
  try {
    let {
      bidNumber,
      userId,
      tenderId,
      amount,
      currency,
      proposalDocument,
      technicalScore,
      financialScore,
      totalScore,
      status,
      type,
      submittedAt,
      reviewedAt,
      validUntil,
      notes,
      evaluatedBy,
      createdBy,
      updatedBy,
      proposedTimeline,
      companyName,
      contactPerson,
      email,
      phone,
      experience,
      portfolio,
      certifications,
      teamSize,
      methodology
    } = req.body;

    // ✅ Auto-generate bidNumber if missing
    if (!bidNumber) {
      bidNumber = generateBidNumber();
    }

    // ✅ Basic required field check
    if (!userId || !tenderId || !amount || !status || !type) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // ✅ Create the bid
    const newBid = await Bid.create({
      id: uuidv4(),
      bidNumber,
      userId,
      tenderId,
      amount,
      proposedTimeline,
      companyName,
      contactPerson,
      email,
      phone,
      experience,
      portfolio,
      certifications,
      teamSize,
      methodology,
      currency,
      proposalDocument,
      technicalScore,
      financialScore,
      totalScore,
      status,
      type,
      submittedAt,
      reviewedAt,
      validUntil,
      notes,
      evaluatedBy,
      createdBy,
      updatedBy
    });

    return res.status(201).json({
      success: true,
      message: 'Bid successfully created',
      data: newBid,
    });

  } catch (error) {
    console.error('Error creating bid:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};




// Get all Bids with tender and user information
exports.getAllBids = async (req, res) => {
  try {
    const bids = await Bid.findAll({
      include: [
        {
          model: Tender,
          as: 'tender', // ✅ lowercase 'tender'
          attributes: [
            'id',
            'title',
            'description',
            'category',
            'budget',
            'deadline',
            'requirements',
            'contactEmail',
            'contactPhone',
            'location',
            'status',
            'createdAt'
          ],
          include: [
            {
              model: User,
              as: 'organisation', // ✅ this alias is correct in Tender.associate
              attributes: ['name', 'email']
            }
          ]
        },
        {
          model: User,
          as: 'user', // ✅ matches Bid.associate
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(bids);
  } catch (error) {
    console.error('Error fetching bids with tender:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};


// Alternative: Simple getAllBids without includes (for testing)
exports.getAllBidsSimple = async (req, res) => {
  try {
    const bids = await Bid.findAll({
      order: [['createdAt', 'DESC']]
    });

    console.log('Fetched simple bids:', JSON.stringify(bids, null, 2));
    return res.status(200).json(bids);
  } catch (error) {
    console.error('Error fetching simple bids:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Get Bids by User ID
exports.getBidsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const bids = await Bid.findAll({
      where: { userId: userId },
      include: [
        {
          model: Tender,
          as: 'tender',
          attributes: [
            'id',
            'title',
            'description',
            'category',
            'budget',
            'deadline',
            'requirements',
            'location',
            'status'
          ],
          include: [
            {
              model: Organisation,
              as: 'organisation',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({ success: true, data: bids });
  } catch (error) {
    console.error('Error fetching bids by userId:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Get Bid by ID
exports.getBidById = async (req, res) => {
  try {
    const { id } = req.params;
    const bid = await Bid.findByPk(id, {
      include: [
        {
          model: Tender,
          as: 'tender',
          include: [
            {
              model: Organisation,
              as: 'organisation'
            }
          ]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    
    if (!bid) {
      return res.status(404).json({ success: false, message: 'Bid not found' });
    }
    
    return res.status(200).json({ success: true, data: bid });
  } catch (error) {
    console.error('Error fetching bid:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Update Bid
exports.updateBid = async (req, res) => {
  try {
    const { id } = req.params;
    const bid = await Bid.findByPk(id);
    if (!bid) {
      return res.status(404).json({ success: false, message: 'Bid not found' });
    }

    await bid.update(req.body);
    return res.status(200).json({
      success: true,
      message: 'Bid updated successfully',
      data: bid,
    });
  } catch (error) {
    console.error('Error updating bid:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Delete Bid
exports.deleteBid = async (req, res) => {
  try {
    const { id } = req.params;
    const bid = await Bid.findByPk(id);
    if (!bid) {
      return res.status(404).json({ success: false, message: 'Bid not found' });
    }

    await bid.destroy();
    return res.status(200).json({
      success: true,
      message: 'Bid deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting bid:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};