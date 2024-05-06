import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { userModel } from '../models/userModel.js'
export const auth_routes = express()

// signup
auth_routes.post('/signup', async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.json({ message: 'add all the fields' })
  }
  try {
    const user = await userModel.findOne({ email }).exec()
    if (user === null) {
      const newPassword = await bcrypt.hash(password, 6)
      const newUser = new userModel({ name, email, password: newPassword })
      await newUser.save()
      res.json({ message: 'user created'})
    } else {
      res.json({ message: 'user already existed' })
    }
  } catch (err) {
    return res.json({ message: err })
  }
})

// signin
auth_routes.get('/signin/:email/:password', async (req, res) => {
  const { email, password } = req.params
  if (!email || !password) {
    return res.json({ message: 'add all the fields' })
  }
  try {
    const user = await userModel.findOne({ email }).exec()
    if (user !== null) {
      const isEmailAndPasswordMatch = await bcrypt.compare(
        password,
        user.password
      )
      if (isEmailAndPasswordMatch) {
        const { _id, name, email } = user
        const token = jwt.sign({ _id, name, email }, process.env.JWT_KEY)
        res.json({ message: 'user verified', user: {_id, name, email, token} })
      } else {
        res.json({ message: 'wrong email or password' })
      }
    } else {
      res.json({ message: 'wrong email or password' })
    }
  } catch (err) {
    return res.json({ message: err })
  }
})
