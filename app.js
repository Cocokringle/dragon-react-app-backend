const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const authRouter = require('./routes/api/auth')
const app = express()
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/openapi3_0.json');

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

app.use('/api/users', authRouter)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app