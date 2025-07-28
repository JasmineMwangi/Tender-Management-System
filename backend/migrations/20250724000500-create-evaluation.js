'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('evaluations', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            evaluationNumber: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
                comment: 'Auto-generated evaluation reference number'
            },
            bidId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { 
                    model: 'bids', 
                    key: 'id' 
                },
                onDelete: 'CASCADE', // If bid deleted, remove evaluations
                onUpdate: 'CASCADE',
            },
            tenderId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { 
                    model: 'tenders', 
                    key: 'id' 
                },
                onDelete: 'CASCADE', // If tender deleted, remove evaluations
                onUpdate: 'CASCADE',
                comment: 'Denormalized for faster queries'
            },
            evaluationType: {
                type: Sequelize.ENUM('technical', 'financial', 'compliance', 'overall', 'preliminary', 'final'),
                allowNull: false,
                defaultValue: 'overall',
                comment: 'Type of evaluation being conducted'
            },
            evaluationPhase: {
                type: Sequelize.ENUM('initial_screening', 'technical_review', 'financial_review', 'final_assessment', 'award_recommendation'),
                allowNull: false,
                defaultValue: 'initial_screening',
                comment: 'Phase of the evaluation process'
            },
            // Scoring System
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
            complianceScore: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: true,
                validate: {
                    min: 0,
                    max: 100
                },
                comment: 'Compliance evaluation score (0-100)'
            },
            overallScore: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: true,
                validate: {
                    min: 0,
                    max: 100
                },
                comment: 'Overall weighted score (0-100)'
            },
            maxPossibleScore: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 100.00,
                validate: {
                    min: 1
                },
                comment: 'Maximum possible score for normalization'
            },
            // Weighted scoring
            technicalWeight: {
                type: Sequelize.DECIMAL(3, 2),
                allowNull: false,
                defaultValue: 0.70,
                validate: {
                    min: 0,
                    max: 1
                },
                comment: 'Weight for technical score (0-1)'
            },
            financialWeight: {
                type: Sequelize.DECIMAL(3, 2),
                allowNull: false,
                defaultValue: 0.30,
                validate: {
                    min: 0,
                    max: 1
                },
                comment: 'Weight for financial score (0-1)'
            },
            // Evaluation Details
            strengths: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'Identified strengths of the bid'
            },
            weaknesses: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'Identified weaknesses of the bid'
            },
            remarks: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'General evaluation remarks and comments'
            },
            recommendations: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'Evaluator recommendations'
            },
            // Evaluation Status
            status: {
                type: Sequelize.ENUM('draft', 'in_progress', 'completed', 'reviewed', 'approved', 'rejected'),
                allowNull: false,
                defaultValue: 'draft',
                comment: 'Current status of the evaluation'
            },
            isDisqualified: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                comment: 'Whether the bid is disqualified'
            },
            disqualificationReason: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'Reason for disqualification if applicable'
            },
            // Evaluation Criteria Met
            criteriaMetCount: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    min: 0
                },
                comment: 'Number of evaluation criteria met'
            },
            totalCriteriaCount: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    min: 0
                },
                comment: 'Total number of evaluation criteria'
            },
            // Timing
            startedAt: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: 'When evaluation started'
            },
            completedAt: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: 'When evaluation was completed'
            },
            reviewedAt: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: 'When evaluation was reviewed'
            },
            approvedAt: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: 'When evaluation was approved'
            },
            // Evaluator Information
            evaluatedBy: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { 
                    model: 'users', 
                    key: 'id' 
                },
                onDelete: 'RESTRICT', // Don't allow deleting evaluator
                onUpdate: 'CASCADE',
                comment: 'Primary evaluator'
            },
            reviewedBy: {
                type: Sequelize.UUID,
                allowNull: true,
                references: { 
                    model: 'users', 
                    key: 'id' 
                },
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
                comment: 'User who reviewed the evaluation'
            },
            approvedBy: {
                type: Sequelize.UUID,
                allowNull: true,
                references: { 
                    model: 'users', 
                key: 'id' 
                },
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
                comment: 'User who approved the evaluation'
            },
            // Audit Trail
            createdBy: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { 
                    model: 'users', 
                    key: 'id' 
                },
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE',
                comment: 'User who created the evaluation'
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
                comment: 'User who last updated the evaluation'
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
        await queryInterface.addIndex('evaluations', ['evaluationNumber'], {
            unique: true,
            name: 'evaluations_evaluation_number_unique'
        });

        await queryInterface.addIndex('evaluations', ['bidId'], {
            name: 'evaluations_bid_id_index'
        });

        await queryInterface.addIndex('evaluations', ['tenderId'], {
            name: 'evaluations_tender_id_index'
        });

        await queryInterface.addIndex('evaluations', ['evaluationType'], {
            name: 'evaluations_evaluation_type_index'
        });

        await queryInterface.addIndex('evaluations', ['evaluationPhase'], {
            name: 'evaluations_evaluation_phase_index'
        });

        await queryInterface.addIndex('evaluations', ['status'], {
            name: 'evaluations_status_index'
        });

        await queryInterface.addIndex('evaluations', ['evaluatedBy'], {
            name: 'evaluations_evaluated_by_index'
        });

        await queryInterface.addIndex('evaluations', ['reviewedBy'], {
            name: 'evaluations_reviewed_by_index'
        });

        await queryInterface.addIndex('evaluations', ['approvedBy'], {
            name: 'evaluations_approved_by_index'
        });

        await queryInterface.addIndex('evaluations', ['overallScore'], {
            name: 'evaluations_overall_score_index'
        });

        await queryInterface.addIndex('evaluations', ['isDisqualified'], {
            name: 'evaluations_is_disqualified_index'
        });

        await queryInterface.addIndex('evaluations', ['completedAt'], {
            name: 'evaluations_completed_at_index'
        });

        await queryInterface.addIndex('evaluations', ['approvedAt'], {
            name: 'evaluations_approved_at_index'
        });

        // Composite indexes for common queries
        await queryInterface.addIndex('evaluations', ['tenderId', 'status'], {
            name: 'evaluations_tender_status_index'
        });

        await queryInterface.addIndex('evaluations', ['bidId', 'evaluationType'], {
            name: 'evaluations_bid_type_index'
        });

        await queryInterface.addIndex('evaluations', ['tenderId', 'overallScore'], {
            name: 'evaluations_tender_score_index'
        });

        await queryInterface.addIndex('evaluations', ['evaluatedBy', 'status'], {
            name: 'evaluations_evaluator_status_index'
        });

        await queryInterface.addIndex('evaluations', ['status', 'completedAt'], {
            name: 'evaluations_status_completed_index'
        });

        // Unique constraint to prevent duplicate evaluations
        await queryInterface.addIndex('evaluations', ['bidId', 'evaluationType', 'evaluationPhase'], {
            unique: true,
            name: 'evaluations_bid_type_phase_unique',
            where: {
                deletedAt: null
            }
        });

        // Index for soft delete queries
        await queryInterface.addIndex('evaluations', ['deletedAt'], {
            name: 'evaluations_deleted_at_index'
        });

        // Full-text search on text fields
        await queryInterface.addIndex('evaluations', ['remarks'], {
            name: 'evaluations_remarks_fulltext',
            type: 'FULLTEXT'
        });

        // Audit trail indexes
        await queryInterface.addIndex('evaluations', ['createdBy'], {
            name: 'evaluations_created_by_index'
        });

        await queryInterface.addIndex('evaluations', ['updatedBy'], {
            name: 'evaluations_updated_by_index'
        });
    },

    down: async (queryInterface) => {
        // Drop indexes first
        const indexesToDrop = [
            'evaluations_evaluation_number_unique',
            'evaluations_bid_id_index',
            'evaluations_tender_id_index',
            'evaluations_evaluation_type_index',
            'evaluations_evaluation_phase_index',
            'evaluations_status_index',
            'evaluations_evaluated_by_index',
            'evaluations_reviewed_by_index',
            'evaluations_approved_by_index',
            'evaluations_overall_score_index',
            'evaluations_is_disqualified_index',
            'evaluations_completed_at_index',
            'evaluations_approved_at_index',
            'evaluations_tender_status_index',
            'evaluations_bid_type_index',
            'evaluations_tender_score_index',
            'evaluations_evaluator_status_index',
            'evaluations_status_completed_index',
            'evaluations_bid_type_phase_unique',
            'evaluations_deleted_at_index',
            'evaluations_remarks_fulltext',
            'evaluations_created_by_index',
            'evaluations_updated_by_index'
        ];

        for (const indexName of indexesToDrop) {
            try {
                await queryInterface.removeIndex('evaluations', indexName);
            } catch (error) {
                // Index might not exist, continue
                console.log(`Index ${indexName} not found, skipping...`);
            }
        }
        
        // Drop the table
        await queryInterface.dropTable('evaluations');
    },
};