'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('tenders', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            title: {
                type: Sequelize.STRING(500),
                allowNull: false,
                validate: {
                    len: [5, 500]
                }
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            requirements: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'Detailed technical and business requirements'
            },
            budget: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: true,
                validate: {
                    min: 0
                }
            },
            currency: {
                type: Sequelize.STRING(3),
                allowNull: false,
                defaultValue: 'USD',
                validate: {
                    len: [3, 3] // ISO currency codes are 3 chars
                }
            },
            deadline: {
                type: Sequelize.DATE,
                allowNull: false,
                validate: {
                    isAfter: new Date().toISOString() // Must be future date
                }
            },
            publishedAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            closedAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM('draft', 'published', 'open', 'closed', 'awarded', 'cancelled'),
                allowNull: false,
                defaultValue: 'draft',
            },
            priority: {
                type: Sequelize.ENUM('low', 'medium', 'high', 'urgent'),
                allowNull: false,
                defaultValue: 'medium',
            },
            category: {
                type: Sequelize.STRING(100),
                allowNull: true,
                comment: 'Tender category for classification'
            },
            organizationId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { 
                    model: 'users', 
                    key: 'id' 
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT', // Don't allow deleting user with active tenders
            },
            createdBy: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { 
                    model: 'users', 
                    key: 'id' 
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
                comment: 'User who created the tender'
            },
            updatedBy: {
                type: Sequelize.UUID,
                allowNull: true,
                references: { 
                    model: 'users', 
                    key: 'id' 
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                comment: 'User who last updated the tender'
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
        await queryInterface.addIndex('tenders', ['organizationId'], {
            name: 'tenders_organization_id_index'
        });
        
        await queryInterface.addIndex('tenders', ['status'], {
            name: 'tenders_status_index'
        });
        
        await queryInterface.addIndex('tenders', ['deadline'], {
            name: 'tenders_deadline_index'
        });

        await queryInterface.addIndex('tenders', ['publishedAt'], {
            name: 'tenders_published_at_index'
        });

        await queryInterface.addIndex('tenders', ['category'], {
            name: 'tenders_category_index'
        });

        await queryInterface.addIndex('tenders', ['priority'], {
            name: 'tenders_priority_index'
        });

        // Composite indexes for common queries
        await queryInterface.addIndex('tenders', ['status', 'deadline'], {
            name: 'tenders_status_deadline_index'
        });

        await queryInterface.addIndex('tenders', ['organizationId', 'status'], {
            name: 'tenders_org_status_index'
        });

        // Full-text search index for title and description (MySQL specific)
        await queryInterface.addIndex('tenders', ['title'], {
            name: 'tenders_title_fulltext',
            type: 'FULLTEXT'
        });

        // Index for soft delete queries
        await queryInterface.addIndex('tenders', ['deletedAt'], {
            name: 'tenders_deleted_at_index'
        });

        // Add audit tracking indexes
        await queryInterface.addIndex('tenders', ['createdBy'], {
            name: 'tenders_created_by_index'
        });

        await queryInterface.addIndex('tenders', ['updatedBy'], {
            name: 'tenders_updated_by_index'
        });
    },

    down: async (queryInterface) => {
        // Drop indexes first
        const indexesToDrop = [
            'tenders_organization_id_index',
            'tenders_status_index',
            'tenders_deadline_index',
            'tenders_published_at_index',
            'tenders_category_index',
            'tenders_priority_index',
            'tenders_status_deadline_index',
            'tenders_org_status_index',
            'tenders_title_fulltext',
            'tenders_deleted_at_index',
            'tenders_created_by_index',
            'tenders_updated_by_index'
        ];

        for (const indexName of indexesToDrop) {
            try {
                await queryInterface.removeIndex('tenders', indexName);
            } catch (error) {
                // Index might not exist, continue
                console.log(`Index ${indexName} not found, skipping...`);
            }
        }
        
        // Drop the table
        await queryInterface.dropTable('tenders');
    },
};