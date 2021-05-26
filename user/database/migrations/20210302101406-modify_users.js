'use strict';
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('users','uid',{
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      autoIncrement: false,
      unique: true
    })

    await queryInterface.addColumn(
      'users',
      'firstName',
      {
        type: Sequelize.STRING,
        validate: {
          is: ["^[a-z]+$",'i'],
          len: [2,40]
        },
        allowNull: false
      },
    )

    await queryInterface.addColumn(
      'users',
      'middleName',
      {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          is: ["^[a-z]+$",'i'],
          len: [2,40]
        }
      },
    )

    await queryInterface.addColumn(
      'users',
      'lastName',
      {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          is: ["^[a-z]+$",'i'],
          len: [2,40]
        }
      },
    )

    await queryInterface.addColumn(
      'users',
      'gender',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    )
    await queryInterface.addColumn(
      'users',
      'mobileNumber',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    )

    await queryInterface.addColumn(
      'users',
      'dob',
      {
        type: Sequelize.DATEONLY,
        allowNull: false
      }
    )

    await queryInterface.addColumn(
      'users',
      'password',
      {
          type: Sequelize.STRING,
          allowNull: false,
          set: function (val) {
            let hash = bcrypt.hashSync(val, 10);
            this.setDataValue("password", hash);
          }
        }
    )

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('uid');
    await queryInterface.removeColumn('password');
    await queryInterface.removeColumn('dob');
    await queryInterface.removeColumn('mobileNumber');
    await queryInterface.removeColumn('gender');
    await queryInterface.removeColumn('lastName');
    await queryInterface.removeColumn('firstName');
    await queryInterface.removeColumn('middleName');
  }
};
