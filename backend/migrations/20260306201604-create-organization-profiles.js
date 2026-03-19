'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('organizationprofile', {
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
      organizationName: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: ''
      },
      organizationType: {
        type: Sequelize.ENUM('government', 'private', 'ngo', 'public', 'semi-government'),
        allowNull: false,
        defaultValue: 'private'
      },
      registrationNumber: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true
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
      alternatePhone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      logo: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      website: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      industry: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      foundedYear: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      numberOfEmployees: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      address: {
        type: Sequelize.TEXT,
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
      // Contact person
      contactPersonFirstName: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      contactPersonLastName: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      contactPersonTitle: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      contactPersonEmail: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      contactPersonPhone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      // Banking
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
      // Verification
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      verificationStatus: {
        type: Sequelize.ENUM('pending', 'verified', 'rejected'),
        defaultValue: 'pending'
      },
      verificationDocuments: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      certifications: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      // Stats — matches frontend
      totalTendersPosted: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      activeTenders: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      completedTenders: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      rating: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: true,
        defaultValue: 0
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

    await queryInterface.addIndex('organizationprofile', ['userId'],             { name: 'org_profiles_user_id_index' });
    await queryInterface.addIndex('organizationprofile', ['email'],              { name: 'org_profiles_email_index' });
    await queryInterface.addIndex('organizationprofile', ['verificationStatus'], { name: 'org_profiles_verification_index' });
    await queryInterface.addIndex('organizationprofile', ['organizationType'],   { name: 'org_profiles_type_index' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('organizationprofile');
  }
};
