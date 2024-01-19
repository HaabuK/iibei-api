const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "mariadb",
        define: {
            timestamps: false
        }
    }
)

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize
db.jobs = require("./models/Job.model")(sequelize,Sequelize)
db.professions = require("./models/Profession.model")(sequelize,Sequelize)
db.workers = require("./models/Employee.model")(sequelize,Sequelize)
db.clients = require("./models/Client.model")(sequelize,Sequelize)
db.workersInProfession = require("./models/WorkersInProfession.model")(sequelize, Sequelize, db.workers, db.professions);
// db.orderedjobs = require("./models/Orderedjobs.model")(sequelize,Sequelize, db.workers, db.clients)

async function Sync() {
    await sequelize.sync({alter:true}) 
}

module.exports = {db,Sync}