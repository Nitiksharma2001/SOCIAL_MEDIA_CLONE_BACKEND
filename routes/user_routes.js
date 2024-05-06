import express from 'express'
import jwt from 'jsonwebtoken'
import { userModel } from '../models/userModel.js'

export const user_routes = express()

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

// follow a user
user_routes.get('/:id', async(req, res) => {
  const userId = req.params.id
  try{
    const user = await userModel.findById(userId)
    res.json(user)
  }
  catch(err){
    res.json('error')
  }
})
user_routes.put('/follow/:id', authenticate, async(req, res) => {
    const toFollowUserId = req.params.id
    const {_id} = req.user
    try{
      const user = await userModel.findOne({_id}).exec()
      user.followings.push(_id)
      await user.save()
      const followedUser = await userModel.findOne({_id: toFollowUserId}).exec()
      followedUser.followers.push(_id)
      await followedUser.save()
      res.json({message: 'followed a user', user, followedUser})
    }
    catch(err){
      res.json({message: err})
    }
  })

// unfollow a user
user_routes.put('/unfollow/:id', authenticate, async(req, res) => {
    const toFollowUserId = req.params.id
    const {_id} = req.user
    try{
      const user = await userModel.findOne({_id}).exec()
      user.followings.pull(_id)
      await user.save()
      const followedUser = await userModel.findOne({_id: toFollowUserId}).exec()
      followedUser.followers.pull(_id)
      await followedUser.save()
      res.json({message: 'unfollowed a user', user, followedUser})
    }
    catch(err){
      res.json({message: err})
    }
  })
 
  