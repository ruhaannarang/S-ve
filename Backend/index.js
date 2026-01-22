const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./db')
const router = require('./routes/auth')
const app = express()
connectDB()
dotenv.config()
app.use(cors())
const port = 3000

app.use(express.json())
app.use('/api/auth', require('./routes/auth'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
