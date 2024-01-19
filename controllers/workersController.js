const {db} = require("../db")
const Worker = db.workers
// const Profession = require('./models/Profession.model');
// const WorkersInProfession = require('./models/WorkersInProfession.model');

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

exports.associateProfession = async (req, res) => {
    const workerId = req.params.workerId;
    const professionId = req.params.professionId;
  
    try {
      // Find the worker and profession by their IDs
      const worker = await Worker.findByPk(workerId);
      const profession = await Profession.findByPk(professionId);
  
      if (!worker || !profession) {
        return res.status(404).json({ error: 'Worker or profession not found' });
      }
  
      // Create association using Sequelize method
      await worker.addProfession(profession);
  
      res.json({ success: true });
    } catch (error) {
      console.error('Error associating profession with worker:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };

exports.deleteById = async (req, res) => {
    let result
    try {
        result = await Worker.destroy({where: {id: req.params.id}})
    } catch (error) {
        console.log("WorkersDelete: ", error)
        res.status(500).send({error:"Something has gone wrong"})
        return
    }
    if (result === 0) {
        res.status(404).send({error:"Worker not found"})
        return
    }
    res
    .status(204).send()
}

exports.updateById = async (req, res) => {
    let result
    delete req.body.id
    try {
        result = await Worker.update(req.body,{where: {id: req.params.id}})
    } catch (error) {
        console.log("WorkersUpdate: ", error)
        res.status(500).send({error:"Something has gone wrong"})
        return
    }
    if (result === 0) {
        res.status(404).send({error:"Worker not found"})
        return
    }
    const worker = await Worker.findByPk(req.params.id)
    res.status(200)
    .location(`${getBaseUrl(req)}/workers/${worker.id}`)
    .json(worker)
}

getBaseUrl = (request) => {
    return (
        (request.connection && request.connection.encryption ? "https" : "http") +
        `://${request.headers.host}`
    )
}