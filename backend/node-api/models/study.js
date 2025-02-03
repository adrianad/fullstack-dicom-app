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
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    idPatient: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Patients',
        key: 'idPatient'
      }
    },
    StudyName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    CreatedDate: {
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
