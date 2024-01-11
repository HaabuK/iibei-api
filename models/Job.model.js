module.exports = (sequelize, Sequelize) => {
  const Job = sequelize.define("jobs", {
    id:{
      type: Sequelize.INTEGER,
      primaryKey: true,
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