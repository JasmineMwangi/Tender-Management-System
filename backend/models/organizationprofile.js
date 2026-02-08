// models/organizationprofile.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const OrganizationProfile = sequelize.define('OrganizationProfile', {
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
    organizationName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    organizationType: {
      type: DataTypes.ENUM('government', 'private', 'ngo', 'public', 'semi-government'),
      allowNull: false,
      defaultValue: 'private'
    },
    registrationNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    taxId: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    alternatePhone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    industry: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    foundedYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1800,
        max: new Date().getFullYear()
      }
    },
    numberOfEmployees: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    postalCode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    contactPersonFirstName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    contactPersonLastName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    contactPersonTitle: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    contactPersonEmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    contactPersonPhone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    bankName: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    bankAccountNumber: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    bankRoutingNumber: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verificationStatus: {
      type: DataTypes.ENUM('pending', 'verified', 'rejected'),
      defaultValue: 'pending'
    },
    verificationDocuments: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'JSON array of document URLs'
    },
    certifications: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'JSON array of certifications'
    },
    totalTendersPosted: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    activeTenders: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    completedTenders: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 5
      }
    }
  }, {
    tableName: 'organization_profiles',
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['email']
      },
      {
        fields: ['registrationNumber']
      },
      {
        fields: ['verificationStatus']
      },
      {
        fields: ['organizationType']
      }
    ]
  });

  OrganizationProfile.associate = (models) => {
    // OrganizationProfile.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    // OrganizationProfile.hasMany(models.Tender, { foreignKey: 'organizationId', as: 'tenders' });
  };

  return OrganizationProfile;
};