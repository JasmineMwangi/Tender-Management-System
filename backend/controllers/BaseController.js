/ backend/controllers/BaseController.js
const { Op } = require('sequelize');
const asyncHandler = require('express-async-handler');

class BaseController {
  constructor(model) {
    this.model = model;
  }

  // Get all records with pagination and filtering
  getAll = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const searchFields = req.query.search ? this.getSearchFields() : [];
    const where = {};
    
    // Add search functionality
    if (req.query.search && searchFields.length > 0) {
      where[Op.or] = searchFields.map(field => ({
        [field]: { [Op.like]: `%${req.query.search}%` }
      }));
    }
    
    // Add filters
    Object.keys(req.query).forEach(key => {
      if (!['page', 'limit', 'search', 'sort', 'order'].includes(key)) {
        where[key] = req.query[key];
      }
    });
    
    const order = req.query.sort ? 
      [[req.query.sort, req.query.order || 'ASC']] : 
      [['createdAt', 'DESC']];
    
    const { count, rows } = await this.model.findAndCountAll({
      where,
      limit,
      offset,
      order,
      include: this.getIncludeOptions()
    });
    
    res.json({
      data: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      }
    });
  });

  // Get single record
  getById = asyncHandler(async (req, res) => {
    const record = await this.model.findByPk(req.params.id, {
      include: this.getIncludeOptions()
    });
    
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json(record);
  });

  // Create new record
  create = asyncHandler(async (req, res) => {
    const data = { ...req.body };
    if (req.user) {
      data.createdBy = req.user.id;
    }
    
    const record = await this.model.create(data);
    res.status(201).json(record);
  });

  // Update record
  update = asyncHandler(async (req, res) => {
    const record = await this.model.findByPk(req.params.id);
    
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    const data = { ...req.body };
    if (req.user) {
      data.updatedBy = req.user.id;
    }
    
    await record.update(data);
    res.json(record);
  });

  // Delete record (soft delete)
  delete = asyncHandler(async (req, res) => {
    const record = await this.model.findByPk(req.params.id);
    
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    await record.update({ deletedAt: new Date() });
    res.json({ message: 'Record deleted successfully' });
  });

  // Override these methods in child controllers
  getSearchFields() {
    return ['name', 'title', 'description'];
  }

  getIncludeOptions() {
    return [];
  }
}

module.exports = BaseController;
