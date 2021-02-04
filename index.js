process.stdout.write('\x1B[2J\x1B[0f') // Clear terminal screen
require('dotenv').config()

const express = require('express')

const cors = require('cors')
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);
const morgan = require('morgan')
const path = require('path')

// MONGOOSE
mongoose.connect(process.env.MONGO_URL, {
  dbName: process.env.MONGO_DB || 'test',
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}, err => {
  if (err) { throw new Error(err) }
  console.info('💾 Connected to Mongo Database \n')
})

// ADDING MIDDLEWARES & ROUTER
const app = express()
  .use(cors())
  .use(morgan('combined'))
  .use(express.json())
  .use(express.static(path.join(__dirname, 'public')))
  .use('/api', require('./api/routes'))

// Init server
const PORT = process.env.PORT || 2222
app.listen(PORT, (err) => {
  if (err) { throw new Error(err) }
  console.info('>'.repeat(40))
  console.info('💻  VetMeet Live')
  console.info(`📡  PORT: http://localhost:${PORT}`)
  console.info('>'.repeat(40) + '\n')
  // Emails
  const { emailsBodies } = require('./api/utils/emails/emails')
  if (emailsBodies &&
    Object.values(emailsBodies).length > 0 &&
    Object.values(emailsBodies).every(x => x && x.length > 0)) {
    console.info('💾 Emails bodies loaded correctly:')
    console.info('    ', Object.keys(emailsBodies).join('\n    '), '\n')
  }
})
