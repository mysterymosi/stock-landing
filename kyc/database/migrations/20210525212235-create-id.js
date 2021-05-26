'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ids', {
      uid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        autoIncrement: false,
        unique: true
      },
      type: {
        type: Sequelize.STRING
      },
      id: {
        type: Sequelize.STRING
      },
      userId: {
        type: DataTypes.UUID,
        references: {
          model: 'users', //'users' references tableName
          key: 'uid'
        },
        unique: true
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ids');
  }
};