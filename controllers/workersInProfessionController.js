const {db} = require('../db')
const WorkersInProfession = db.workersInProfession

//xh POST http://localhost:7070/workersInProfession workerId=5 professionId=5
//xh get http://localhost:7070/workersInProfession
//xh put http://localhost:7070/workersInProfession/6 professionId=5

exports.getAll = async (req,res) => {
    const workersInProfession = await WorkersInProfession.findAll({attributes:["id", "workerId", "professionId"]})
    res.send(workersInProfession)
}

exports.getById = async (req, res) => {
  const workersInProfession = await WorkersInProfession.findByPk(req.params.id)
  res.send(workersInProfession)
}

exports.createNew = async (req, res) => {
  let workerInProfession
  try {
    workerInProfession = await WorkersInProfession.create(req.body)
  } catch (error) {
      if (error instanceof db.Sequelize.ValidationError) {
          console.log(error)
          res.status(400).send({"error":error.errors.map((item)=> item.message)})
      } else {
          console.log("WorkersInProfessionCreate: ", error)
          res.status(500).send({"error":"Something has gone wrong"})
      }
      return
  }
  res
  .status(201)
  .location(`${getBaseUrl(req)}/workersInProfession/${workerInProfession.id}`)
  .json(workerInProfession);
  console.log(workerInProfession)
}

exports.updateById = async (req, res) => {
  let result;
  delete req.body.id;
  
  try {
    result = await WorkersInProfession.update(req.body, { where: { id: req.params.id } });
  } catch (error) {
    console.log("WorkersInProfessionUpdate: ", error);
    res.status(500).send({ error: "Something has gone wrong" });
    return;
  }

  if (result[0] === 0) {
    res.status(404).send({ error: "WorkersInProfession not found" });
    return;
  }

  try {
    const workerInProfession = await WorkersInProfession.findByPk(req.params.id);
    res
      .status(200)
      .location(`${getBaseUrl(req)}/workersInProfession/${workerInProfession.id}`)
      .json(workerInProfession);
  } catch (error) {
    console.log("WorkersInProfessionFindByPk: ", error);
    res.status(500).send({ error: "Something has gone wrong" });
  }
};

  