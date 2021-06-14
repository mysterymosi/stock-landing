'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    uid: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      autoIncrement: false,
      unique: true
    },
    email: {
      type:DataTypes.STRING,
      allowNull: false,
      validate:{
        isEmail: true
      }
    },
    mobileNumber: {
      type:DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      validate: {
        is: ["^[a-z]+$",'i'],
        len: [2,40]
      },
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        is: ["^[a-z]+$",'i'],
        len: [2,40]
      },
      allowNull: false
    },
    middleName: {
      type: DataTypes.STRING,
      validate: {
        is: ["^[a-z]+$",'i'],
        len: [2,40]
      },
      defaultValue: ""
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dob: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password:{
      type:DataTypes.STRING,
      allowNull: false,
      set: function (val) {
        let hash = bcrypt.hashSync(val, 10);
        this.setDataValue("password", hash);
      }
    }

  }, {
    sequelize,
    modelName: 'user',
  });
  return User;
};