const { Bid } = require('../models');
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

// Get all Bids
exports.getAllBids = async (req, res) => {
  try {
    const bids = await Bid.findAll();
    return res.status(200).json({ success: true, data: bids });
  } catch (error) {
    console.error('Error fetching bids:', error);
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
    const bid = await Bid.findByPk(id);
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
