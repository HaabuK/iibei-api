const {db} = require("../db")
const Profession = db.professions

//xh get http://localhost:7070/professions
//xh get http://localhost:7070/professions/1

//xh post http://localhost:7070/professions field=Transportation name="B-category driver"
//xh put http://localhost:7070/professions/3 name="Bike deliverer"
//xh delete http://localhost:7070/professions/3

exports.getAll = async (req,res) => {
    const professions = await Profession.findAll({attributes:["id", "field", "name"]})
    res.send(professions)
}

exports.getById = async (req, res) => {
    const professions = await Profession.findByPk(req.params.id)
    res.send(professions)
}

exports.createNew = async (req, res) => {
    let profession
    try {
        profession = await Profession.create(req.body)
    } catch (error) {
        if (error instanceof db.Sequelize.ValidationError) {
            console.log(error)
            res.status(400).send({"error":error.errors.map((item)=> item.message)})
        } else {
            console.log("ProfessionsCreate: ", error)
            res.status(500).send({"error":"Something has gone wrong"})
        }
        return
    }
    res
    .status(201)
    .location(`${getBaseUrl(req)}/professions/${profession.id}`)
    .json(profession);
    console.log(profession)
}

exports.updateById = async (req, res) => {
    let result
    delete req.body.id
    try {
        result = await Profession.update(req.body,{where: {id: req.params.id}})
    } catch (error) {
        console.log("ProfessionsUpdate: ", error)
        res.status(500).send({error:"Something has gone wrong"})
        return
    }
    if (result === 0) {
        res.status(404).send({error:"Profession not found"})
        return
    }
    const profession = await Profession.findByPk(req.params.id)
    res.status(200)
    .location(`${getBaseUrl(req)}/professions/${profession.id}`)
    .json(profession)
}

exports.deleteById = async (req, res) => {
    let result
    try {
        result = await Profession.destroy({where: {id: req.params.id}})
    } catch (error) {
        console.log("ProfessionsDelete: ", error)
        res.status(500).send({error:"Something has gone wrong"})
        return
    }
    if (result === 0) {
        res.status(404).send({error:"Profession not found"})
        return
    }
    res
    .status(204).send()
}

getBaseUrl = (request) => {
    return (
        (request.connection && request.connection.encryption ? "https" : "http") +
        `://${request.headers.host}`
    )
}