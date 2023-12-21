const { sequelize, Sequelize } = require("../db");

module.exports = (sequelize, Sequelize) => {
  const Job = sequelize.define("job", {
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

  return Job;
}