'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('attachments', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            filename: {
                type: Sequelize.STRING(255),
                allowNull: false,
                comment: 'Original filename as uploaded by user'
            },
            originalName: {
                type: Sequelize.STRING(255),
                allowNull: false,
                comment: 'Original filename before any processing'
            },
            fileUrl: {
                type: Sequelize.STRING(500),
                allowNull: true,
                comment: 'Public URL for file access (if using cloud storage)'
            },
            filePath: {
                type: Sequelize.STRING(500),
                allowNull: false,
                comment: 'Physical file path or cloud storage key'
            },
            fileSize: {
                type: Sequelize.BIGINT,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 104857600 // 100MB limit
                },
                comment: 'File size in bytes'
            },
            fileType: {
                type: Sequelize.STRING(100),
                allowNull: false,
                comment: 'MIME type of the file'
            },
            fileExtension: {
                type: Sequelize.STRING(10),
                allowNull: false,
                comment: 'File extension (e.g., .pdf, .docx)'
            },
            category: {
                type: Sequelize.ENUM(
                    'tender_document', 
                    'bid_proposal', 
                    'technical_specification', 
                    'financial_document', 
                    'legal_document', 
                    'certificate', 
                    'image', 
                    'other'
                ),
                allowNull: false,
                defaultValue: 'other',
                comment: 'Category of the attachment for organization'
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'Optional description of the attachment'
            },
            isPublic: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                comment: 'Whether the file is publicly accessible'
            },
            isRequired: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                comment: 'Whether this attachment is required for the tender/bid'
            },
            status: {
                type: Sequelize.ENUM('uploading', 'processing', 'active', 'archived', 'corrupted'),
                allowNull: false,
                defaultValue: 'active',
                comment: 'Current status of the attachment'
            },
            checksum: {
                type: Sequelize.STRING(64),
                allowNull: true,
                comment: 'File checksum for integrity verification (SHA-256)'
            },
            downloadCount: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    min: 0
                },
                comment: 'Number of times file has been downloaded'
            },
            lastAccessedAt: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: 'When the file was last accessed/downloaded'
            },
            expiresAt: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: 'When the file expires (for temporary files)'
            },
            // Foreign Key Relationships
            tenderId: {
                type: Sequelize.UUID,
                allowNull: true,
                references: { 
                    model: 'tenders', 
                    key: 'id' 
                },
                onDelete: 'CASCADE', // If tender deleted, remove attachments
                onUpdate: 'CASCADE',
                comment: 'Associated tender (if applicable)'
            },
            bidId: {
                type: Sequelize.UUID,
                allowNull: true,
                references: { 
                    model: 'bids', 
                    key: 'id' 
                },
                onDelete: 'CASCADE', // If bid deleted, remove attachments
                onUpdate: 'CASCADE',
                comment: 'Associated bid (if applicable)'
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: true,
                references: { 
                    model: 'users', 
                    key: 'id' 
                },
                onDelete: 'SET NULL', // Keep attachment even if user deleted
                onUpdate: 'CASCADE',
                comment: 'User who uploaded the file'
            },
            // Audit Trail
            uploadedBy: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { 
                    model: 'users', 
                    key: 'id' 
                },
                onDelete: 'RESTRICT', // Don't allow deleting user who uploaded files
                onUpdate: 'CASCADE',
                comment: 'User who uploaded the attachment'
            },
            updatedBy: {
                type: Sequelize.UUID,
                allowNull: true,
                references: { 
                    model: 'users', 
                    key: 'id' 
                },
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
                comment: 'User who last updated the attachment metadata'
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
        await queryInterface.addIndex('attachments', ['tenderId'], {
            name: 'attachments_tender_id_index'
        });

        await queryInterface.addIndex('attachments', ['bidId'], {
            name: 'attachments_bid_id_index'
        });

        await queryInterface.addIndex('attachments', ['userId'], {
            name: 'attachments_user_id_index'
        });

        await queryInterface.addIndex('attachments', ['uploadedBy'], {
            name: 'attachments_uploaded_by_index'
        });

        await queryInterface.addIndex('attachments', ['fileType'], {
            name: 'attachments_file_type_index'
        });

        await queryInterface.addIndex('attachments', ['category'], {
            name: 'attachments_category_index'
        });

        await queryInterface.addIndex('attachments', ['status'], {
            name: 'attachments_status_index'
        });

        await queryInterface.addIndex('attachments', ['isPublic'], {
            name: 'attachments_is_public_index'
        });

        await queryInterface.addIndex('attachments', ['isRequired'], {
            name: 'attachments_is_required_index'
        });

        await queryInterface.addIndex('attachments', ['checksum'], {
            name: 'attachments_checksum_index'
        });

        await queryInterface.addIndex('attachments', ['expiresAt'], {
            name: 'attachments_expires_at_index'
        });

        await queryInterface.addIndex('attachments', ['lastAccessedAt'], {
            name: 'attachments_last_accessed_at_index'
        });

        // Composite indexes for common queries
        await queryInterface.addIndex('attachments', ['tenderId', 'category'], {
            name: 'attachments_tender_category_index'
        });

        await queryInterface.addIndex('attachments', ['bidId', 'category'], {
            name: 'attachments_bid_category_index'
        });

        await queryInterface.addIndex('attachments', ['userId', 'fileType'], {
            name: 'attachments_user_file_type_index'
        });

        await queryInterface.addIndex('attachments', ['status', 'expiresAt'], {
            name: 'attachments_status_expires_index'
        });

        // Full-text search on filename and description
        await queryInterface.addIndex('attachments', ['filename'], {
            name: 'attachments_filename_fulltext',
            type: 'FULLTEXT'
        });

        // Index for soft delete queries
        await queryInterface.addIndex('attachments', ['deletedAt'], {
            name: 'attachments_deleted_at_index'
        });

        // Add constraint to ensure attachment belongs to either tender, bid, or user
        await queryInterface.addConstraint('attachments', {
            fields: ['tenderId', 'bidId', 'userId'],
            type: 'check',
            name: 'attachments_parent_check',
            where: {
                [Sequelize.Op.or]: [
                    { tenderId: { [Sequelize.Op.ne]: null } },
                    { bidId: { [Sequelize.Op.ne]: null } },
                    { userId: { [Sequelize.Op.ne]: null } }
                ]
            }
        });
    },

    down: async (queryInterface) => {
        // Drop constraints first
        await queryInterface.removeConstraint('attachments', 'attachments_parent_check');

        // Drop indexes first
        const indexesToDrop = [
            'attachments_tender_id_index',
            'attachments_bid_id_index',
            'attachments_user_id_index',
            'attachments_uploaded_by_index',
            'attachments_file_type_index',
            'attachments_category_index',
            'attachments_status_index',
            'attachments_is_public_index',
            'attachments_is_required_index',
            'attachments_checksum_index',
            'attachments_expires_at_index',
            'attachments_last_accessed_at_index',
            'attachments_tender_category_index',
            'attachments_bid_category_index',
            'attachments_user_file_type_index',
            'attachments_status_expires_index',
            'attachments_filename_fulltext',
            'attachments_deleted_at_index'
        ];

        for (const indexName of indexesToDrop) {
            try {
                await queryInterface.removeIndex('attachments', indexName);
            } catch (error) {
                // Index might not exist, continue
                console.log(`Index ${indexName} not found, skipping...`);
            }
        }
        
        // Drop the table
        await queryInterface.dropTable('attachments');
    },
};