'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Enhanced file loading with error reporting
fs
  .readdirSync(__dirname)
  // .filter(file => {
  //   return (
  //     file.indexOf('.') !== 0 &&
  //     file !== basename &&
  //     file.slice(-3) === '.js' &&
  //     file.indexOf('.test.js') === -1
  //   );
  // })

  .filter(file => {
  return (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file !== 'BaseModel.js' && // 👈 Exclude it
    file.slice(-3) === '.js' &&
    file.indexOf('.test.js') === -1
  );
})

  .forEach(file => {
    const modelPath = path.join(__dirname, file);
    console.log(`📦 Attempting to load model: ${file}`);

    const modelExport = require(modelPath);

    if (typeof modelExport !== 'function') {
      console.error(`❌ Error: ${file} does NOT export a function. Please check the module.exports.`);
      throw new TypeError(`${file} must export a function that takes (sequelize, DataTypes)`);
    }

    const model = modelExport(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Run associations if defined
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
