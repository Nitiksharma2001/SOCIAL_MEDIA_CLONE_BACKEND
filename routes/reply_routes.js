import express from 'express'
import jwt from 'jsonwebtoken'
import { userModel } from '../models/userModel.js'
import { postModel } from '../models/postModel.js'
import { commentModel } from '../models/commentModel.js'
import { replyModel } from '../models/replyModel.js'

export const reply_routes = express()

const authenticate = (req, res, next) => {
  const token = req.headers.authorization.substring(7)
  jwt.verify(token, process.env.JWT_KEY, (err, resp) => {
    if (resp) {
      req.user = resp
      next()
    } else {
      res.json({ message: err })
    }
  })
}
// get all the replies
reply_routes.get('/:commentId', async (req, res) => {
  const {commentId} = req.params
  const comments = await replyModel
    .find({ comment: commentId })
    .populate({
      path: 'user',
      select: '-password',
    })
    .exec()
  res.json(comments)
})

// add a reply
reply_routes.post('/:commentId', authenticate, async (req, res) => {
  const { replyValue } = req.body
  const {commentId} = req.params
  const { _id } = req.user
  try {
    let newReply = await new replyModel({
      user: _id,
      comment: commentId,
      replyValue,
    }).save()
    newReply = await newReply.populate({ path: 'user', select: '-password' })
    res.json({ message: 'reply created', reply: newReply })
  } catch (err) {
    res.json({ message: err })
  }
})
// delete a reply
reply_routes.delete('/:id', authenticate, async (req, res) => {
  const replyId = req.params.id
  try {
    await replyModel.deleteOne({_id: replyId})
    res.json({ message: 'reply deleted'})
  } catch (err) {
    res.json({ message: err })
  }
})

// update a reply
reply_routes.put('/:id', authenticate, async (req, res) => {
  const replyId = req.params.id
  const {replyValue} = req.body
  try {
    let reply = await replyModel.findOne({_id: replyId}).exec()
    reply = await reply.populate({path: 'user', select:'-password'})
    reply.replyValue = replyValue
    await reply.save()
    res.json({ message: 'reply updated', reply})
  } catch (err) {
    res.json({ message: err })
  }
})

