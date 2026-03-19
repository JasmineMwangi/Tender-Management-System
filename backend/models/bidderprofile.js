'use strict';

module.exports = (sequelize, DataTypes) => {
  const BidderProfile = sequelize.define('BidderProfile', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: { model: 'users', key: 'id' }
    },
    profileType: {
      type: DataTypes.ENUM('individual', 'company'),
      allowNull: false,
      defaultValue: 'individual'
    },
    firstName:   { type: DataTypes.STRING(100), allowNull: false, defaultValue: '' },
    lastName:    { type: DataTypes.STRING(100), allowNull: false, defaultValue: '' },
    email:       { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
    phone:       { type: DataTypes.STRING(20),  allowNull: true },
    profileImage:{ type: DataTypes.STRING(500), allowNull: true },

    // Company info — matches frontend exactly
    companyName:               { type: DataTypes.STRING(255), allowNull: true },
    companyRegistrationNumber: { type: DataTypes.STRING(100), allowNull: true },
    businessRegistration:      { type: DataTypes.STRING(100), allowNull: true },
    taxId:                     { type: DataTypes.STRING(100), allowNull: true },
    businessCategory:          { type: DataTypes.STRING(255), allowNull: true },
    yearsInBusiness:           { type: DataTypes.INTEGER,     allowNull: true, defaultValue: 0 },
    website:                   { type: DataTypes.STRING(255), allowNull: true },

    // Address — matches frontend (uses 'address' not 'street')
    address:    { type: DataTypes.STRING(255), allowNull: true },
    city:       { type: DataTypes.STRING(100), allowNull: true },
    state:      { type: DataTypes.STRING(100), allowNull: true },
    country:    { type: DataTypes.STRING(100), allowNull: true },
    postalCode: { type: DataTypes.STRING(20),  allowNull: true },

    // Professional info
    expertise:        { type: DataTypes.JSON,         defaultValue: [] },
    specialization:   { type: DataTypes.STRING(255),  allowNull: true }, // optional now
    yearsOfExperience:{ type: DataTypes.INTEGER,       allowNull: true, defaultValue: 0 },
    certifications:   { type: DataTypes.JSON,         defaultValue: [] },
    qualifications:   { type: DataTypes.JSON,         defaultValue: [] },
    portfolio:        { type: DataTypes.JSON,         defaultValue: [] },
    financialInfo:    { type: DataTypes.JSON,         allowNull: true },

    // Banking — matches frontend
    bankName:          { type: DataTypes.STRING(200), allowNull: true },
    bankAccountNumber: { type: DataTypes.STRING(100), allowNull: true },
    bankRoutingNumber: { type: DataTypes.STRING(100), allowNull: true },

    // Stats — matches frontend
    totalBids:      { type: DataTypes.INTEGER,      defaultValue: 0 },
    successfulBids: { type: DataTypes.INTEGER,      defaultValue: 0 },
    rating:         { type: DataTypes.DECIMAL(3,2), allowNull: true, defaultValue: 0 },

    verificationStatus: {
      type: DataTypes.ENUM('pending', 'verified', 'rejected'),
      defaultValue: 'pending'
    }
  }, {
    tableName: 'bidderprofile',
    timestamps: true
  });

  BidderProfile.associate = (models) => {
    BidderProfile.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return BidderProfile;
};
// // models/BidderProfile.js
// 'use strict';

// module.exports = (sequelize, DataTypes) => {

// const BidderProfile = sequelize.define('BidderProfile', {
//   id: {
//     type: DataTypes.UUID,
//     primaryKey: true,
//       defaultValue: DataTypes.UUIDV4,  // ← add this
//     // autoIncrement: true
//   },
//   userId: {
//     type: DataTypes.UUID,
//     allowNull: false,
//     unique: true,
//     references: {
//       model: 'users',
//       key: 'id'
//     }
//   },
//   profileType: {
//     type: DataTypes.ENUM('individual', 'company'),
//     allowNull: false
//   },
//   // Personal Information
//   firstName: {
//     type: DataTypes.STRING(100),
//     allowNull: false
//   },
//   lastName: {
//     type: DataTypes.STRING(100),
//     allowNull: false
//   },
//   // Company Information
//   companyName: {
//     type: DataTypes.STRING(255),
//     allowNull: true
//   },
//   businessRegistration: {
//     type: DataTypes.STRING(100),
//     allowNull: true
//   },
//   // Contact Details
//   email: {
//     type: DataTypes.STRING(255),
//     allowNull: false,
//     validate: {
//       isEmail: true
//     }
//   },
//   phone: {
//     type: DataTypes.STRING(20),
//     allowNull: false
//   },
//   // Address fields
//   street: {
//     type: DataTypes.STRING(255),
//     allowNull: true
//   },
//   city: {
//     type: DataTypes.STRING(100),
//     allowNull: true
//   },
//   state: {
//     type: DataTypes.STRING(100),
//     allowNull: true
//   },
//   country: {
//     type: DataTypes.STRING(100),
//     allowNull: true
//   },
//   postalCode: {
//     type: DataTypes.STRING(20),
//     allowNull: true
//   },
//   // Professional Information
//   expertise: {
//     type: DataTypes.JSON,
//     defaultValue: []
//   },
//   specialization: {
//     type: DataTypes.STRING(255),
//     allowNull: false
//   },
//   yearsOfExperience: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     defaultValue: 0
//   },
//   // Certifications stored as JSON
//   certifications: {
//     type: DataTypes.JSON,
//     defaultValue: []
//   },
//   // Qualifications stored as JSON
//   qualifications: {
//     type: DataTypes.JSON,
//     defaultValue: []
//   },
//   // Portfolio stored as JSON
//   portfolio: {
//     type: DataTypes.JSON,
//     defaultValue: []
//   },
//   // Financial Information stored as JSON
//   financialInfo: {
//     type: DataTypes.JSON,
//     allowNull: true
//   },
//   verificationStatus: {
//     type: DataTypes.ENUM('pending', 'verified', 'rejected'),
//     defaultValue: 'pending'
//   },
//   profileImage: {
//     type: DataTypes.STRING(500),
//     allowNull: true
//   }
// }, {
//   tableName: 'bidderprofile',
//   timestamps: true
// });

// return BidderProfile;
// };
