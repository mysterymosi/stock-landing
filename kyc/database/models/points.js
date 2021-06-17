'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class points extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  points.init({
    uid: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      autoIncrement: false,
      unique: true
    },
    license: DataTypes.INTEGER,
    bill: DataTypes.INTEGER,
    passport: DataTypes.INTEGER,
    id: DataTypes.INTEGER,
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
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'points',
  });
  return points;
};