import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    content: { type: String, required: true },
    group: { type: Schema.Types.ObjectId, ref: "Group" },
    sentBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model("Message", MessageSchema);
