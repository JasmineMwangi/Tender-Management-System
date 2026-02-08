// controllers/profileController.js
const db = require('../models');
const { AdminProfile, BidderProfile, OrganizationProfile, User } = db;

// Admin Profile Controllers
exports.getAdminProfile = async (req, res) => {
  try {
    const profile = await AdminProfile.findOne({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Admin profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin profile', error: error.message });
  }
};

exports.createAdminProfile = async (req, res) => {
  try {
    const existingProfile = await AdminProfile.findOne({
      where: { userId: req.user.id }
    });

    if (existingProfile) {
      return res.status(400).json({ message: 'Admin profile already exists' });
    }

    const profile = await AdminProfile.create({
      userId: req.user.id,
      ...req.body
    });

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin profile', error: error.message });
  }
};

exports.updateAdminProfile = async (req, res) => {
  try {
    const profile = await AdminProfile.findOne({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Admin profile not found' });
    }

    await profile.update(req.body);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error updating admin profile', error: error.message });
  }
};

exports.uploadAdminImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const profile = await AdminProfile.findOne({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Admin profile not found' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    await profile.update({ profileImage: imageUrl });

    res.json({ message: 'Image uploaded successfully', imageUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
};

// Bidder Profile Controllers
exports.getBidderProfile = async (req, res) => {
  try {
    const profile = await BidderProfile.findOne({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Bidder profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bidder profile', error: error.message });
  }
};

exports.createBidderProfile = async (req, res) => {
  try {
    const existingProfile = await BidderProfile.findOne({
      where: { userId: req.user.id }
    });

    if (existingProfile) {
      return res.status(400).json({ message: 'Bidder profile already exists' });
    }

    const profile = await BidderProfile.create({
      userId: req.user.id,
      ...req.body
    });

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error creating bidder profile', error: error.message });
  }
};

exports.updateBidderProfile = async (req, res) => {
  try {
    const profile = await BidderProfile.findOne({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Bidder profile not found' });
    }

    await profile.update(req.body);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error updating bidder profile', error: error.message });
  }
};

exports.uploadBidderImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const profile = await BidderProfile.findOne({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Bidder profile not found' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    await profile.update({ profileImage: imageUrl });

    res.json({ message: 'Image uploaded successfully', imageUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
};

exports.verifyBidderProfile = async (req, res) => {
  try {
    const { userId, status } = req.body;

    const profile = await BidderProfile.findOne({
      where: { userId }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Bidder profile not found' });
    }

    await profile.update({
      verificationStatus: status,
      isVerified: status === 'verified'
    });

    res.json({ message: 'Bidder profile verification updated', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying bidder profile', error: error.message });
  }
};

// Organization Profile Controllers
exports.getOrganizationProfile = async (req, res) => {
  try {
    const profile = await OrganizationProfile.findOne({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Organization profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organization profile', error: error.message });
  }
};

exports.createOrganizationProfile = async (req, res) => {
  try {
    const existingProfile = await OrganizationProfile.findOne({
      where: { userId: req.user.id }
    });

    if (existingProfile) {
      return res.status(400).json({ message: 'Organization profile already exists' });
    }

    const profile = await OrganizationProfile.create({
      userId: req.user.id,
      ...req.body
    });

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error creating organization profile', error: error.message });
  }
};

exports.updateOrganizationProfile = async (req, res) => {
  try {
    const profile = await OrganizationProfile.findOne({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Organization profile not found' });
    }

    await profile.update(req.body);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error updating organization profile', error: error.message });
  }
};

exports.uploadOrganizationLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const profile = await OrganizationProfile.findOne({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Organization profile not found' });
    }

    const logoUrl = `/uploads/${req.file.filename}`;
    await profile.update({ logo: logoUrl });

    res.json({ message: 'Logo uploaded successfully', logoUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading logo', error: error.message });
  }
};

exports.verifyOrganizationProfile = async (req, res) => {
  try {
    const { userId, status } = req.body;

    const profile = await OrganizationProfile.findOne({
      where: { userId }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Organization profile not found' });
    }

    await profile.update({
      verificationStatus: status,
      isVerified: status === 'verified'
    });

    res.json({ message: 'Organization profile verification updated', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying organization profile', error: error.message });
  }
};

// Get profile by user ID (for admin)
exports.getProfileByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profile;
    if (user.role === 'admin') {
      profile = await AdminProfile.findOne({ where: { userId } });
    } else if (user.role === 'bidder') {
      profile = await BidderProfile.findOne({ where: { userId } });
    } else if (user.role === 'organization') {
      profile = await OrganizationProfile.findOne({ where: { userId } });
    }

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ user, profile });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};