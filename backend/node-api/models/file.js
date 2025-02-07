'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    static associate(models) {
      File.belongsTo(models.Series, { foreignKey: 'idSeries' });
    }
  }
  File.init({
    idFile: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    idSeries: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Series',
        key: 'idSeries'
      }
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'File'
  });

  return File;
};
