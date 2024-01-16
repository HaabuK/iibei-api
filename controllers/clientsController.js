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

exports.createNew = async (req, res) => {
    let client
    try {
        client = await Client.create(req.body)
    } catch (error) {
        if (error instanceof db.Sequelize.ValidationError) {
            console.log(error)
            res.status(400).send({"error":error.errors.map((item)=> item.message)})
        } else {
            console.log("WorkersCreate: ", error)
            res.status(500).send({"error":"Something has gone wrong"})
        }
        return
    }
    res
    .status(201)
    .location(`${getBaseUrl(req)}/clients/${client.id}`)
    .json(client);
    console.log(client)
}

exports.updateById = async (req, res) => {
    let result
    delete req.body.id
    try {
        result = await Client.update(req.body,{where: {id: req.params.id}})
    } catch (error) {
        console.log("WorkersUpdate: ", error)
        res.status(500).send({error:"Something has gone wrong"})
        return
    }
    if (result === 0) {
        res.status(404).send({error:"Client not found"})
        return
    }
    const client = await Client.findByPk(req.params.id)
    res.status(200)
    .location(`${getBaseUrl(req)}/clients/${client.id}`)
    .json(client)
}

getBaseUrl = (request) => {
    return (
        (request.connection && request.connection.encryption ? "https" : "http") +
        `://${request.headers.host}`
    )
}