'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bidderprofile', {
      id: {
        type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,  // ← add this
        primaryKey: true,
        // autoIncrement: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      profileType: {
        type: Sequelize.ENUM('individual', 'company'),
        allowNull: false,
        defaultValue: 'individual'
      },
      firstName: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: ''
      },
      lastName: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: ''
      },
      companyName: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      businessRegistration: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      // matches frontend: companyRegistrationNumber
      companyRegistrationNumber: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      taxId: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: ''
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      // matches frontend: businessCategory
      businessCategory: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      // matches frontend: yearsInBusiness
      yearsInBusiness: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      state: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      postalCode: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      website: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      // Professional info
      expertise: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      specialization: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      yearsOfExperience: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      certifications: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      qualifications: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      portfolio: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      // Financial info
      bankName: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      bankAccountNumber: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      bankRoutingNumber: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      financialInfo: {
        type: Sequelize.JSON,
        allowNull: true
      },
      // Stats — matches frontend
      totalBids: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      successfulBids: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      rating: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: true,
        defaultValue: 0
      },
      verificationStatus: {
        type: Sequelize.ENUM('pending', 'verified', 'rejected'),
        defaultValue: 'pending'
      },
      profileImage: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('bidderprofile', ['userId'], { name: 'bidderprofile_user_id_index' });
    await queryInterface.addIndex('bidderprofile', ['verificationStatus'], { name: 'bidderprofile_verification_index' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('bidderprofile');
  }
};