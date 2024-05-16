import mongoose, { mongo } from 'mongoose'
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  imageAddress: {
    type: String,
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: 0,
    },
  ],
  followings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: 0,
    },
  ],
})
export const userModel = mongoose.model('User', userSchema)
