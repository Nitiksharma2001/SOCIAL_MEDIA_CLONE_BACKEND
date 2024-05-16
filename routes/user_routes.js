import express from 'express'
import jwt from 'jsonwebtoken'
import { userModel } from '../models/userModel.js'
import { postModel } from '../models/postModel.js'

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

user_routes.get('/:id', async (req, res) => {
  const userId = req.params.id
  try {
    const user = await userModel.findById(userId).select('-password')
    const posts = await postModel.find({ user: userId }).exec()
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        imageAddress: user.imageAddress,
        followers: user.followers.length,
        followings: user.followings.length,
      },
      posts,
    })
  } catch (err) {
    res.json('error')
  }
})

// follow a user
user_routes.put('/follow/:id', authenticate, async (req, res) => {
  const toFollowUserId = req.params.id
  const { _id } = req.user
  try {
    // increasing following of req.user
    await userModel.findByIdAndUpdate(_id, {
      $push: {
        followings: toFollowUserId,
      },
    })
    // increasing follower of toFollowUser
    await userModel.findByIdAndUpdate(toFollowUserId, {
      $push: {
        followers: _id,
      },
    })
    res.json({ message: 'followed the user' })
  } catch (err) {
    res.json({ message: err })
  }
})

// unfollow a user
user_routes.put('/unfollow/:id', authenticate, async (req, res) => {
  const toFollowUserId = req.params.id
  const { _id } = req.user
  try {
    // decreasing followings of req.user
    await userModel.findByIdAndUpdate(_id, {
      $pull: {
        followings: toFollowUserId,
      },
    })
    // decreasing followers of toFollowUser
    await userModel.findByIdAndUpdate(toFollowUserId, {
      $pull: {
        followers: _id,
      },
    })
    res.json({ message: 'followed the user' })
  } catch (err) {
    res.json({ message: err })
  }
})

// user with id is followed by loggedIn user or not
user_routes.get('/follow/:id', authenticate, async (req, res) => {
  const loggedInUser = req.user._id
  const id = req.params.id
  try {
    const result = (await userModel.findById(id)).followers.includes(
      loggedInUser
    )
    res.json({ findOrNot: result })
  } catch (err) {
    res.json(err)
  }
})

// user with id is followed by loggedIn user or not
user_routes.get('/user-exist/:userId', async (req, res) => {
  const { userId } = req.params
  try {
    const result = await userModel.findById(userId)
    res.json({ userExists: result ? true : false })
  } catch (err) {
    res.json(err)
  }
})
