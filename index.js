//const app = require('express')()
const express = require('express')
const app = express()
const port = 7070
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./docs/swagger.json')
const yamljs = require('yamljs')

app.use(express.json())

const jobs = [{id: 1,name: "Koristaja", quote: 6},
{id: 2,name: "Kokk", quote: 10.00},
{id: 3,name: "Autojuht", quote: 9.00},
{id: 4,name: "Maaler", quote: 13.50},
{id: 5,name: "Torumees", quote: 15.25},
{id: 6,name: "Lapsehoidja", quote: 8.99},
{id: 7,name: "Ehitaja", quote: 10.99},
{id: 8,name: "Raamatupidaja", quote: 18.00},
{id: 9,name: "Treener", quote: 10.50}]

app.get('/jobs', (req, res) => {
  res. send(jobs)
})

app.get('/jobs/:id', (req, res) => {
  if (typeof jobs[req.params.id -1] === 'undefined'){
    return res.status(404).send({error: "Job not found"})
  }
    res.send(jobs[req.params.id - 1])
})

app.post('/jobs', (req, res) => {
  if (!req.body.name || !req.body.quote) {
    return res.status(400).send({ error: 'One or all params are missing' })
  }
  let job = {
    id: jobs.length + 1, 
    quote: req.body.quote,
    name: req.body.name
  }

  jobs.push(job)
  res.status(201)
  .location(`${getBaseUrl(req)}/jobs/${jobs.length}`)
  .send(job)
})

//xh -v http://localhost:7070/jobs name=Kuller quote=8.60

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
  console.log('API up at: http://localhost:${port}')
})

function getBaseUrl(req) { 
  return req.connection && req.connection.encrypted
  ? 'https': 'http' + `://${req.headers.host}`
}