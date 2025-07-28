// /home/engineer/Desktop/TenderManagementSystem/backend/models/base-model.js
'use strict';

const { DataTypes } = require('sequelize');

/**
 * Base model attributes that should be present in all models
 */
const baseAttributes = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    comment: 'Primary key UUID',
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Record creation timestamp',
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Record last update timestamp',
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Soft delete timestamp',
  },
};

/**
 * Base model options with MySQL optimizations
 */
const baseOptions = {
  timestamps: true,
  underscored: true,
  paranoid: true, // Enables soft deletes
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  engine: 'InnoDB',
  
  // Default indexes that most models will benefit from
  indexes: [
    {
      name: 'idx_created_at',
      fields: ['created_at'],
    },
    {
      name: 'idx_updated_at',
      fields: ['updated_at'],
    },
    {
      name: 'idx_deleted_at',
      fields: ['deleted_at'],
    },
  ],
};

/**
 * Base hooks for common functionality
 */
const baseHooks = {
  beforeValidate: (instance) => {
    // Trim string fields
    Object.keys(instance.dataValues).forEach(key => {
      if (typeof instance.dataValues[key] === 'string') {
        instance.dataValues[key] = instance.dataValues[key].trim();
      }
    });
  },
  
  beforeCreate: (instance) => {
    // Ensure UUID is set
    if (!instance.id) {
      instance.id = DataTypes.UUIDV4();
    }
  },
};

/**
 * Base instance methods available to all models
 */
const baseInstanceMethods = {
  /**
   * Soft delete the record
   */
  async softDelete() {
    return await this.destroy();
  },

  /**
   * Restore a soft-deleted record
   */
  async restoreRecord() {
    return await this.restore();
  },

  /**
   * Check if record is soft deleted
   */
  isDeleted() {
    return this.deleted_at !== null;
  },

  /**
   * Get clean JSON without sensitive/internal fields
   */
  toSafeJSON() {
    const json = this.toJSON();
    // Remove internal fields
    delete json.deleted_at;
    return json;
  },

  /**
   * Update record with audit trail
   */
  async updateWithAudit(updates, userId = null) {
    const oldValues = { ...this.dataValues };
    await this.update(updates);
    
    // Log to audit trail if AuditLog model exists
    if (this.sequelize.models.AuditLog) {
      await this.sequelize.models.AuditLog.create({
        user_id: userId,
        action: 'UPDATE',
        entity: this.constructor.name,
        entity_id: this.id,
        old_values: oldValues,
        new_values: updates,
      });
    }
    
    return this;
  },
};

/**
 * Base class methods available to all models
 */
const baseClassMethods = {
  /**
   * Find all active (non-deleted) records
   */
  findAllActive(options = {}) {
    return this.findAll({
      ...options,
      where: {
        ...options.where,
        deleted_at: null,
      },
    });
  },

  /**
   * Find active record by ID
   */
  findByIdActive(id, options = {}) {
    return this.findOne({
      ...options,
      where: {
        id,
        deleted_at: null,
        ...options.where,
      },
    });
  },

  /**
   * Bulk soft delete records
   */
  async bulkSoftDelete(where, userId = null) {
    const records = await this.findAll({ where });
    const recordIds = records.map(r => r.id);
    
    const result = await this.update(
      { deleted_at: new Date() },
      { where, paranoid: false }
    );

    // Log to audit trail
    if (this.sequelize.models.AuditLog && recordIds.length > 0) {
      await this.sequelize.models.AuditLog.bulkCreate(
        recordIds.map(id => ({
          user_id: userId,
          action: 'DELETE',
          entity: this.name,
          entity_id: id,
        }))
      );
    }

    return result;
  },

  /**
   * Get records with pagination
   */
  async findWithPagination(options = {}) {
    const {
      page = 1,
      limit = 10,
      order = [['created_at', 'DESC']],
      ...findOptions
    } = options;

    const offset = (page - 1) * limit;

    const { count, rows } = await this.findAndCountAll({
      ...findOptions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order,
      distinct: true,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    };
  },
};

module.exports = {
  baseAttributes,
  baseOptions,
  baseHooks,
  baseInstanceMethods,
  baseClassMethods,
};