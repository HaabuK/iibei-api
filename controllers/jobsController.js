const {db} = require("../db")
const Job = db.jobs

exports.getAll = async (req,res) => {
    const jobs = await Job.findAll({attributes:["id", "name", "quote"]})
    res.send(jobs)
}

exports.getById = async (req, res) => {
    const jobs = await Job.findByPk(req.params.id)
    res.send(jobs)
}

exports.createNew = async (req, res) => {
    let job
    try {
        job = await Job.create(req.body)
    } catch (error) {
        if (error instanceof db.Sequelize.ValidationError) {
            console.log(error)
            res.status(400).send({"error":error.errors.map((item)=> item.message)})
        } else {
            console.log("JobsCreate: ", error)
            res.status(500).send({"error":"Something has gone wrong"})
        }
        return
    }
    res
    .status(201)
    .location(`${getBaseUrl(req)}/jobs/${job.id}`)
    .json(job);
    console.log(job)
}

exports.deleteById = async (req, res) => {
    let result
    try {
        result = await Job.destroy({where: {id: req.params.id}})
    } catch (error) {
        console.log("JobsDelete: ", error)
        res.status(500).send({error:"Something has gone wrong"})
        return
    }
    if (result === 0) {
        res.status(404).send({error:"Job not found"})
        return
    }
    res
    .status(204).send()
}

exports.updateById = async (req, res) => {
    let result
    delete req.body.id
    try {
        result = await Job.update(req.body,{where: {id: req.params.id}})
    } catch (error) {
        console.log("JobsUpdate: ", error)
        res.status(500).send({error:"Something has gone wrong"})
        return
    }
    if (result === 0) {
        res.status(404).send({error:"Job not found"})
        return
    }
    const job = await Job.findByPk(req.params.id)
    res.status(200)
    .location(`${getBaseUrl(req)}/jobs/${job.id}`)
    .json(job)
}

getBaseUrl = (request) => {
    return (
        (request.connection && request.connection.encryption ? "https" : "http") +
        `://${request.headers.host}`
    )
}