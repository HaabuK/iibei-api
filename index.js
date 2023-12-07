const app = require('express')()
const port = 7070
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./docs/swagger.json')

app.get('/jobs', (req, res) => {
  res. send([ "Koristaja", "Kokk" ])
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
  console.log('API up at: http://localhost:${port}')
})