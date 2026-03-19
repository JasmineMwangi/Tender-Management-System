const { generateRecommendations } = require('../services/recommendationService');
const { TenderRecommendation, Tender } = require('../models');

exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const recommendations = await generateRecommendations(userId);
    res.json({ success: true, data: recommendations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.saveRecommendation = async (req, res) => {
  try {
    const { tenderId } = req.params;
    await TenderRecommendation.update(
      { isSaved: true },
      { where: { userId: req.user.id, tenderId } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.dismissRecommendation = async (req, res) => {
  try {
    const { tenderId } = req.params;
    await TenderRecommendation.update(
      { isDismissed: true },
      { where: { userId: req.user.id, tenderId } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};