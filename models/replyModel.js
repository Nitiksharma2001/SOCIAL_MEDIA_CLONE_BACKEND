import mongoose from 'mongoose'
const replySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    replyValue: {
      type: String, 
      required: true,
    },
  },
  { timestamps: true }
)
export const replyModel = mongoose.model('Reply', replySchema)
