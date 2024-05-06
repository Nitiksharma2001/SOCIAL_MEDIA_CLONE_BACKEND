import mongoose from 'mongoose'
const likeSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },    
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },    
  },
  { timestamps: true }
)

/*
  SCHEMA
  
  _id: primary key
  userId
  postId

*/
export const likeModel = mongoose.model('Like', likeSchema)
