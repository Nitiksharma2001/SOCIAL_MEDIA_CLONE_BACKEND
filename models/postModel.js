import mongoose from 'mongoose'
const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },    
    noOfLikes: {
      type: Number,
      default : 0,
    },
  },
  { timestamps: true }
)

/*
  SCHEMA
  
  _id: primary key
  title
  description
  imageUrl
  userId
  noOfLikes - whole number

*/
export const postModel = mongoose.model('Post', postSchema)
