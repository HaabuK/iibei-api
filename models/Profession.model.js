module.exports = (sequelize, Sequelize) => {
  const Profession = sequelize.define("professions", {
    id:{
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    field: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    }
  });

  return Profession;
}