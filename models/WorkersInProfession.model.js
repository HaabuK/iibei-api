// workersInProfession.js
module.exports = (sequelize, Sequelize, Employee, Profession) => {
    const WorkersInProfession = sequelize.define("workersInProfession", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      workerId: {
        type: Sequelize.INTEGER,
        references: {
          model: Employee,
          key: "id"
        }
      },
      professionId: {
        type: Sequelize.INTEGER,
        references: {
          model: Profession,
          key: "id"
        }
      }
    });
  
    Employee.belongsToMany(Profession, { through: WorkersInProfession });
    Profession.belongsToMany(Employee, { through: WorkersInProfession });
  
    return WorkersInProfession;
  };
  