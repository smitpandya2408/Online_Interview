import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "admin" | "interviewer" | "candidate";

export interface IUser extends Document {
  email: string;
  name?: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: String,
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "interviewer", "candidate"],
    default: "interviewer",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
