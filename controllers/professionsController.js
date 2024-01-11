const {db} = require("../db")
const Profession = db.professions

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

getBaseUrl = (request) => {
    return (
        (request.connection && request.connection.encryption ? "https" : "http") +
        `://${request.headers.host}`
    )
}