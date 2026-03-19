const { runAnomalyDetection } = require('../services/anomalyDetectionService');
const { AnomalyFlag } = require('../models');

exports.detect = async (req, res) => {
  try {
    const { tenderId } = req.params;
    const flags = await runAnomalyDetection(tenderId);
    res.json({ success: true, data: flags, count: flags.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFlags = async (req, res) => {
  try {
    const { tenderId } = req.params;
    const flags = await AnomalyFlag.findAll({ where: { tenderId }, order: [['severity', 'DESC']] });
    res.json({ success: true, data: flags });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.reviewFlag = async (req, res) => {
  try {
    const { id }               = req.params;
    const { status, reviewNote } = req.body;
    await AnomalyFlag.update({ status, reviewNote, reviewedBy: req.user.id }, { where: { id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};