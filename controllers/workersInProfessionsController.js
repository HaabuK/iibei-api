const {db} = require('../db')
const WorkersInProfessions = db.workersInProfession
const Worker = db.workers

//xh POST http://localhost:7070/workersInProfession workerId=1 professionId=1
//xh POST http://localhost:7070/workersInProfession Content-Type:application/json '{"workerId"= 2, "professionId"= 2}'


exports.getAll = async (req, res) => {
    const workersInProfession = await workersInProfession.findAll({
        include: {all: true},
        logging: console.log
    })
    console.log(workersInProfession);
    let result = []
    result = workersInProfession.map((wp) => {
        return {
            "workerName": wp.worker.name,
            "profession": `$(wp.profession.name)`
        }
    })
    res.send(result);
}

//xh post http://localhost:7070/workersInProfession workerId=2 professionId=2

// exports.createNew = async (req, res) => {
//     const { workerId, professionId } = req.body;
  
//     try {
//       // Check if the worker and profession IDs are provided
//       if (!workerId || !professionId) {
//         return res.status(400).json({ error: 'Worker ID and Profession ID are required' });
//       }
  
//       // Check if the specified worker and profession exist (you may need to adjust this based on your data model)
//       const worker = await db.workers.findByPk(workerId);
//       const profession = await db.professions.findByPk(professionId);
  
//       if (!worker || !profession) {
//         return res.status(404).json({ error: 'Worker or profession not found' });
//       }
  
//       // Create a new entry in WorkersInProfession
//       const workersInProfession = await db.workersInProfession.create({
//         workerId,
//         professionId,
//       });
  
//       res
//         .status(201)
//         .location(`${getBaseUrl(req)}/workersInProfession/${workersInProfession.id}`)
//         .json(workersInProfession);
  
//       console.log(workersInProfession);
//     } catch (error) {
//       if (error instanceof db.Sequelize.ValidationError) {
//         console.log(error);
//         res.status(400).send({ "error": error.errors.map((item) => item.message) });
//       } else {
//         console.log("WorkersInProfessionCreate: ", error);
//         res.status(500).send({ "error": "Something has gone wrong" });
//       }
//     }
//   };

app.post('/workersInProfession', async (req, res) => {
  const { workerId, professionId } = req.body;

  try {
    // Validate input (check if IDs are present)
    if (!workerId || !professionId) {
      return res.status(400).json({ error: 'Worker ID and Profession ID are required' });
    }

    // Check if the specified worker and profession exist in the database
    const worker = await db.workers.findByPk(workerId);
    const profession = await db.professions.findByPk(professionId);

    if (!worker || !profession) {
      return res.status(404).json({ error: 'Worker or profession not found' });
    }

    // Create a new entry in WorkersInProfession
    const workersInProfession = await db.workersInProfession.create({
      workerId,
      professionId,
    });

    res
      .status(201)
      .location(`/workersInProfession/${workersInProfession.id}`)
      .json(workersInProfession);
  } catch (error) {
    console.error('Error creating workersInProfession:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  