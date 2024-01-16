const {db} = require("../db")
const Worker = db.workers

exports.getAll = async (req,res) => {
    const workers = await Worker.findAll({attributes:["id", "name", "salary", "email","phone","company","driverslicense"]})
    res.send(workers)
}

exports.getById = async (req, res) => {
    const workers = await Worker.findByPk(req.params.id)
    res.send(workers)
}

exports.createNew = async (req, res) => {
    let worker
    try {
        worker = await Worker.create(req.body)
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
    .location(`${getBaseUrl(req)}/workers/${worker.id}`)
    .json(worker);
    console.log(worker)
}

getBaseUrl = (request) => {
    return (
        (request.connection && request.connection.encryption ? "https" : "http") +
        `://${request.headers.host}`
    )
}