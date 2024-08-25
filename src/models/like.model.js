import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema(
  {
    message: { type: Schema.Types.ObjectId, ref: "Message" },
    likedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Like = mongoose.model("Like", LikeSchema);
