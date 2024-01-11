const {db} = require("../db")
const Profession = db.professions

exports.getAll = async (req,res) => {
    const professions = await Profession.findAll({attributes:["id", "field", "name"]})
    res.send(professions)
}


getBaseUrl = (request) => {
    return (
        (request.connection && request.connection.encryption ? "https" : "http") +
        `://${request.headers.host}`
    )
}