//const app = require('express')()
require("dotenv").config()
const express = require('express')
const cors = require('cors')
const app = express()
//const port = 7070
const port = process.env.APP_PORT
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./docs/swagger.json')
const yamljs = require('yamljs')
const bodyParser = require('body-parser');
const WorkersInProfession = require('./models/WorkersInProfession.model');

app.use(bodyParser.json());

app.use(cors())
app.use(express.json())

// const professions = [{id: 1,name: "Koristaja", quote: 6},
// {id: 2,name: "Kokk", quote: 10.00},
// {id: 3,name: "Autojuht", quote: 9.00},
// {id: 4,name: "Maaler", quote: 13.50},
// {id: 5,name: "Torumees", quote: 15.25},
// {id: 6,name: "Lapsehoidja", quote: 8.99},
// {id: 7,name: "Ehitaja", quote: 10.99},
// {id: 8,name: "Raamatupidaja", quote: 18.00},
// {id: 9,name: "Treener", quote: 10.50}]

app.use(express.json());

require("./routes/app_routes")(app);

app.get("/errors", async (req,res) => {
  res.statusCode(404).send({"error": "something went wrong"})
})

//PROFESSIONS

app.get('/professions', (req, res) => {
  res.send(professions)
})

app.get('/professions/:id', (req, res) => {
  if (typeof professions[req.params.id -1] === 'undefined'){
    return res.status(404).send({error: "Profession not found"})
  }
    res.send(professions[req.params.id - 1])
})

app.post('/professions', (req, res) => {
  if (!req.body.name || !req.body.quote) {

    return res.status(400).send({ error: 'One or all params are missing' })
  }
  let profession = {
    id: professions.length + 1, 
    quote: req.body.quote,
    name: req.body.name
  }

  professions.push(profession)
  res.status(201)
  .location(`${getBaseUrl(req)}/professions/${profession.length}`)
  .send(profession)
})


app.delete('/professions/:id', (req, res) => {
  if (typeof professions[req.params.id - 1] === 'undefined') {
      return res.status(404).send({error: "profession not found"})
  }
  professions.splice(req.params.id - 1, 1)
  res.status(204).send({error: "No content"})
})

//CLIENTS

app.get('/clients', (req, res) => {
  res.send(clients)
})


app.get('/clients/:id', (req, res) => {
  if (typeof clients[req.params.id -1] === 'undefined'){
    return res.status(404).send({error: "Client not found"})
  }
    res.send(clients[req.params.id - 1])
})

app.post('/clients', (req, res) => {
  if (!req.body.name || !req.body.quote) {

    return res.status(400).send({ error: 'One or all params are missing' })
  }
  let client = {
    id: clients.length + 1, 
    quote: req.body.quote,
    name: req.body.name
  }

  clients.push(client)
  res.status(201)
  .location(`${getBaseUrl(req)}/clients/${client.length}`)
  .send(client)
})


app.delete('/clients/:id', (req, res) => {
  if (typeof clients[req.params.id - 1] === 'undefined') {
      return res.status(404).send({error: "client not found"})
  }
  clients.splice(req.params.id - 1, 1)
  res.status(204).send({error: "No content"})
})


//WORKERS

app.post('/workers/:workerId/associateProfession/:professionId', async (req, res) => {
  const workerId = req.params.workerId;
  const professionId = req.params.professionId;

  try {
    // Check if the association already exists
    const existingAssociation = await WorkersInProfession.findOne({
      where: { workerId, professionId },
    });

    if (existingAssociation) {
      return res.status(400).json({ error: 'Association already exists' });
    }

    // Create a new association
    await WorkersInProfession.create({ workerId, professionId });

    res.json({ success: true });
  } catch (error) {
    console.error('Error associating profession with worker:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/workers', (req, res) => {
  res.send(workers)
})


app.get('/workers/:id', (req, res) => {
  if (typeof workers[req.params.id -1] === 'undefined'){
    return res.status(404).send({error: "Worker not found"})
  }
    res.send(workers[req.params.id - 1])
})

app.post('/workers', (req, res) => {
  if (!req.body.name || !req.body.quote) {

    return res.status(400).send({ error: 'One or all params are missing' })
  }
  let worker = {
    id: workers.length + 1, 
    quote: req.body.quote,
    name: req.body.name
  }

  workers.push(worker)
  res.status(201)
  .location(`${getBaseUrl(req)}/workers/${worker.length}`)
  .send(worker)
})


app.delete('/workers/:id', (req, res) => {
  if (typeof workers[req.params.id - 1] === 'undefined') {
      return res.status(404).send({error: "worker not found"})
  }
  workers.splice(req.params.id - 1, 1)
  res.status(204).send({error: "No content"})
})

//xh -v http://localhost:7070/professions name=Kuller quote=8.60

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, async () => {
  console.log(`API up at: http://localhost:${port}`)
})

// function getBaseUrl(req) { 
//   return req.connection && req.connection.encrypted
//   ? 'https': 'http' + `://${req.headers.host}`
// }

function getBaseUrl(req) { 
  return `${req.protocol}://${req.headers.host}`;
}