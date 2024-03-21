module.exports = (sequelize, Sequelize, Employee, Client) => {
    const Orders = sequelize.define("orders", {
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
      clientId: {
        type: Sequelize.INTEGER,
        references: {
          model: Client,
          key: "id"
        }
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      info: {
        type: Sequelize.STRING,
        allowNull: true,
      }
    });
  
  Employee.belongsToMany(Client, { through: Orders });
  Client.belongsToMany(Employee, { through: Orders });
  Employee.hasMany(Orders);
  Orders.belongsTo(Employee);
  Client.hasMany(Orders);
  Orders.belongsTo(Client);

  return Orders;
};