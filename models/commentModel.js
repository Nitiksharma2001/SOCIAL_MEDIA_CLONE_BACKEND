import mongoose from 'mongoose'
const commentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    commentValue: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)
export const commentModel = mongoose.model('Comment', commentSchema)
