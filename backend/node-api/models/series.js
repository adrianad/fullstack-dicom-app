'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Series extends Model {
    static associate(models) {
      Series.belongsTo(models.Study, { foreignKey: 'idStudy' });
      Series.belongsTo(models.Modality, { foreignKey: 'idModality' });
      Series.hasMany(models.File, { foreignKey: 'idSeries' });
    }
  }
  Series.init({
    idSeries: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    idStudy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Studies',
        key: 'idStudy'
      }
    },
    idModality: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Modalities',
        key: 'idModality'
      }
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Series'
  });

  return Series;
};
