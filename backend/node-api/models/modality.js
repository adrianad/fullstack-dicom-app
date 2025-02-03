'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Modality extends Model {
    static associate(models) {
      Modality.hasMany(models.Series, { foreignKey: 'idModality' });
    }
  }
  Modality.init({
    idModality: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Modality'
  });

  return Modality;
};
