'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('bids', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            bidNumber: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
                comment: 'Auto-generated bid reference number'
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'RESTRICT', // Don't allow deleting user with bids
                onUpdate: 'CASCADE',
            },
            tenderId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'tenders',
                    key: 'id',
                },
                onDelete: 'CASCADE', // If tender deleted, cascade delete bids
                onUpdate: 'CASCADE',
            },
            amount: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: false, // Bid amount should be required
                validate: {
                    min: 0.01 // Minimum bid amount
                },
                comment: 'Bid amount in the tender currency'
            },
            currency: {
                type: Sequelize.STRING(3),
                allowNull: false,
                defaultValue: 'USD',
                validate: {
                    len: [3, 3] // ISO currency codes
                }
            },
            proposalDocument: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'Main proposal text or summary'
            },
            technicalScore: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: true,
                validate: {
                    min: 0,
                    max: 100
                },
                comment: 'Technical evaluation score (0-100)'
            },
            financialScore: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: true,
                validate: {
                    min: 0,
                    max: 100
                },
                comment: 'Financial evaluation score (0-100)'
            },
            totalScore: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: true,
                validate: {
                    min: 0,
                    max: 100
                },
                comment: 'Overall evaluation score (0-100)'
            },
            status: {
                type: Sequelize.ENUM('draft', 'submitted', 'under_review', 'qualified', 'disqualified', 'rejected', 'shortlisted', 'awarded', 'withdrawn'),
                allowNull: false,
                defaultValue: 'draft',
            },
            type: {
                type: Sequelize.ENUM('technical', 'financial', 'combined', 'framework'),
                allowNull: false,
                defaultValue: 'combined',
                comment: 'Type of bid submission'
            },
            submittedAt: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: 'When the bid was officially submitted'
            },
            reviewedAt: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: 'When the bid review was completed'
            },
            validUntil: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: 'Bid validity expiration date'
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'Internal notes or comments about the bid'
            },
            evaluatedBy: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
                comment: 'User who evaluated this bid'
            },
            createdBy: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
                comment: 'User who created the bid (might be different from bidder)'
            },
            updatedBy: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
                comment: 'User who last updated the bid'
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            deletedAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });

        // Add indexes for performance
        await queryInterface.addIndex('bids', ['bidNumber'], {
            unique: true,
            name: 'bids_bid_number_unique'
        });

        await queryInterface.addIndex('bids', ['userId'], {
            name: 'bids_user_id_index'
        });
        
        await queryInterface.addIndex('bids', ['tenderId'], {
            name: 'bids_tender_id_index'
        });
        
        await queryInterface.addIndex('bids', ['status'], {
            name: 'bids_status_index'
        });

        await queryInterface.addIndex('bids', ['type'], {
            name: 'bids_type_index'
        });

        await queryInterface.addIndex('bids', ['submittedAt'], {
            name: 'bids_submitted_at_index'
        });

        await queryInterface.addIndex('bids', ['validUntil'], {
            name: 'bids_valid_until_index'
        });

        await queryInterface.addIndex('bids', ['totalScore'], {
            name: 'bids_total_score_index'
        });

        await queryInterface.addIndex('bids', ['evaluatedBy'], {
            name: 'bids_evaluated_by_index'
        });

        // Composite indexes for common queries
        await queryInterface.addIndex('bids', ['tenderId', 'status'], {
            name: 'bids_tender_status_index'
        });

        await queryInterface.addIndex('bids', ['userId', 'status'], {
            name: 'bids_user_status_index'
        });

        await queryInterface.addIndex('bids', ['tenderId', 'totalScore'], {
            name: 'bids_tender_score_index'
        });

        // Unique constraint to prevent duplicate bids per user per tender
        await queryInterface.addIndex('bids', ['userId', 'tenderId'], {
            unique: true,
            name: 'bids_user_tender_unique',
            where: {
                deletedAt: null // Only for non-deleted records
            }
        });

        // Index for soft delete queries
        await queryInterface.addIndex('bids', ['deletedAt'], {
            name: 'bids_deleted_at_index'
        });

        // Audit trail indexes
        await queryInterface.addIndex('bids', ['createdBy'], {
            name: 'bids_created_by_index'
        });

        await queryInterface.addIndex('bids', ['updatedBy'], {
            name: 'bids_updated_by_index'
        });
    },

    down: async (queryInterface) => {
        // Drop indexes first
        const indexesToDrop = [
            'bids_bid_number_unique',
            'bids_user_id_index',
            'bids_tender_id_index',
            'bids_status_index',
            'bids_type_index',
            'bids_submitted_at_index',
            'bids_valid_until_index',
            'bids_total_score_index',
            'bids_evaluated_by_index',
            'bids_tender_status_index',
            'bids_user_status_index',
            'bids_tender_score_index',
            'bids_user_tender_unique',
            'bids_deleted_at_index',
            'bids_created_by_index',
            'bids_updated_by_index'
        ];

        for (const indexName of indexesToDrop) {
            try {
                await queryInterface.removeIndex('bids', indexName);
            } catch (error) {
                // Index might not exist, continue
                console.log(`Index ${indexName} not found, skipping...`);
            }
        }
        
        // Drop the table
        await queryInterface.dropTable('bids');
    },
};