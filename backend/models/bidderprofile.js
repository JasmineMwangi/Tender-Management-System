// models/BidderProfile.js
'use strict';

module.exports = (sequelize, DataTypes) => {

const BidderProfile = sequelize.define('BidderProfile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  profileType: {
    type: DataTypes.ENUM('individual', 'company'),
    allowNull: false
  },
  // Personal Information
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  // Company Information
  companyName: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  businessRegistration: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  // Contact Details
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  // Address fields
  street: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  postalCode: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  // Professional Information
  expertise: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  specialization: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  yearsOfExperience: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  // Certifications stored as JSON
  certifications: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  // Qualifications stored as JSON
  qualifications: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  // Portfolio stored as JSON
  portfolio: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  // Financial Information stored as JSON
  financialInfo: {
    type: DataTypes.JSON,
    allowNull: true
  },
  verificationStatus: {
    type: DataTypes.ENUM('pending', 'verified', 'rejected'),
    defaultValue: 'pending'
  },
  profileImage: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: 'bidder_profiles',
  timestamps: true
});

return BidderProfile;
};
