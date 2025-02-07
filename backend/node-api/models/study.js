'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Study extends Model {
    static associate(models) {
      Study.belongsTo(models.Patient, { foreignKey: 'idPatient' });
      Study.hasMany(models.Series, { foreignKey: 'idStudy' });
    }
  }
  Study.init({
    idStudy: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    idPatient: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Patients',
        key: 'idPatient'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Study',
    timestamps: true
  });

  return Study;
};
