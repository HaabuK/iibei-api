const { sequelize, Sequelize } = require("../db");

module.exports = (sequelize, Sequelize) => {
  const Iibei = sequelize.define("iibei", {
    id:{
      type: Sequelize.INTEGER,
      primayKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    quote: {
      type: Sequelize.FLOAT,
      allowNull: true,
    }
  });

  return Iibei;
}