'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Series', {
      idSeries: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idStudy: {
        type: Sequelize.INTEGER,
        references: { model: 'Studies', key: 'idStudy' }
      },
      idModality: {
        type: Sequelize.INTEGER,
        references: { model: 'Modalities', key: 'idModality' }
      },
      name: {
        type: Sequelize.STRING
      },
      createdDate: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Series');
  }
};