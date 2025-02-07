'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Series', {
      idSeries: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      idStudy: {
        allowNull: false,
        type: Sequelize.STRING,
        references: { model: 'Studies', key: 'idStudy' }
      },
      idModality: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Modalities', key: 'idModality' }
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      date: {
        allowNull: false,
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