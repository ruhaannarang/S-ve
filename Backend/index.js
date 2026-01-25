const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./db')
const Posts = require('./models/posts')
const router = require('./routes/auth')
const app = express()
connectDB()
dotenv.config()
app.use(cors())
const port = 3000

app.use(express.json())
app.use('/api/auth', require('./routes/auth'))

app.post('/addpost', (req, res) => {
  console.log(req.body)
  const { username, caption, image } = req.body
  const newPost = new Posts({
    username,
    caption,
    image
  })
  newPost.save()
  res.send('Post added successfully')
})

app.get('/getposts', async (req, res) => {
  try {
    const posts = await Posts.find({})
    res.json(posts)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error fetching posts')
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
