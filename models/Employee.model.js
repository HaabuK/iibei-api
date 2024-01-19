module.exports = (sequelize, Sequelize) => {
  const Employee = sequelize.define("workers", {
    id:{
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    salary: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    company: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    driverslicense: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });

  return Employee;
}