import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  roomId: string;
  sender: string;
  text: string;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema({
  roomId: {
    type: String,
    required: true,
    index: true,
  },
  sender: {
    type: String,
    required: true,
    default: "Anonymous",
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

export const Message =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
