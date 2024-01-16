const {db} = require("../db")
const Client = db.clients

exports.getAll = async (req,res) => {
    const clients = await Client.findAll({attributes:["id", "name", "location", "email","phone","company"]})
    res.send(clients)
}

exports.getById = async (req, res) => {
    const clients = await Client.findByPk(req.params.id)
    res.send(clients)
}

getBaseUrl = (request) => {
    return (
        (request.connection && request.connection.encryption ? "https" : "http") +
        `://${request.headers.host}`
    )
}