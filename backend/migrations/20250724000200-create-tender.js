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
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            category: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            budget: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: true,
            },
            deadline: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            requirements: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            contactEmail: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            contactPhone: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            location: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM('draft', 'published', 'pending', 'closed'),
                allowNull: false,
                defaultValue: 'draft',
            },
            organizationId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
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
        await queryInterface.addIndex('tenders', ['category'], {
            name: 'tenders_category_index'
        });
        await queryInterface.addIndex('tenders', ['deletedAt'], {
            name: 'tenders_deletedAt_index'
        });
    },

    down: async (queryInterface) => {
        const indexesToDrop = [
            'tenders_organization_id_index',
            'tenders_status_index',
            'tenders_deadline_index',
            'tenders_category_index',
            'tenders_deletedAt_index'
        ];

        for (const indexName of indexesToDrop) {
            try {
                await queryInterface.removeIndex('tenders', indexName);
            } catch (error) {
                console.log(`Index ${indexName} not found, skipping...`);
            }
        }

        await queryInterface.dropTable('tenders');
    },
};
