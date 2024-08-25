import mongoose, { Schema } from "mongoose";

const GroupSchema = new Schema(
  {
    name: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export const Group = mongoose.model("Group", GroupSchema);
