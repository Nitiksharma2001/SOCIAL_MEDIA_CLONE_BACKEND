import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { auth_routes } from './routes/auth_routes.js'
import { post_routes } from './routes/post_routes.js'
import { comment_routes } from './routes/comment_routes.js'
import { reply_routes } from './routes/reply_routes.js'
import { user_routes } from './routes/user_routes.js'
import { likeModel } from './models/likeModel.js'
// import { user_todo_routes } from './routes/user_todo_routes.js'
const PORT = process.env.PORT || 4000;
const mongoDbAtlas = process.env.MONGO_URI

const app = express()
app.use(express.json())
app.use(cors())

app.use('/auth/', auth_routes)
app.use('/user/', user_routes)
app.use('/post/', post_routes)
app.use('/comment/', comment_routes)
app.use('/reply/', reply_routes)


app.listen(PORT, () => {
  mongoose.connect(mongoDbAtlas).then(()=> {
      console.log('listening to port', PORT)
  })
})
