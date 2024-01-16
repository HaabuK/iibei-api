const {db} = require("../db")
const Worker = db.workers

exports.getAll = async (req,res) => {
    const workers = await Worker.findAll({attributes:["id", "name", "salary", "email","phone","company","driverslicense"]})
    res.send(workers)
}

getBaseUrl = (request) => {
    return (
        (request.connection && request.connection.encryption ? "https" : "http") +
        `://${request.headers.host}`
    )
}