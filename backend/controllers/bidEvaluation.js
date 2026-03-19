const { evaluateBidsForTender } = require('../services/bidEvaluationService');
const { BidEvaluation, Bid, User } = require('../models');

exports.evaluate = async (req, res) => {
  try {
    const { tenderId } = req.params;
    const { weights }  = req.body; // optional custom weights
    const results = await evaluateBidsForTender(tenderId, weights);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMatrix = async (req, res) => {
  try {
    const { tenderId } = req.params;
    const evaluations = await BidEvaluation.findAll({
      where: { tenderId },
      include: [
        { model: Bid,  attributes: ['bidAmount', 'submittedAt'] },
        { model: User, as: 'Bidder', attributes: ['name', 'company'] }
      ],
      order: [['rank', 'ASC']]
    });
    res.json({ success: true, data: evaluations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id }     = req.params;
    const { status } = req.body;
    await BidEvaluation.update({ status, evaluatedBy: req.user.id }, { where: { id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};