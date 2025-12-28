import mongoose, { Schema, Document } from "mongoose";
import { nanoid } from "nanoid";

export interface IInterview extends Document {
  roomId: string;
  title?: string;
  durationMinutes?: number;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  status: "created" | "started" | "ended";
  participants: {
    interviewer?: string;
    candidate?: string;
  };
  notes?: string;
  code?: string;
  language?: "javascript" | "python";
}

const InterviewSchema: Schema = new Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    default: () => nanoid(10),
  },
  title: {
    type: String,
    default: "Interview Session",
  },
  durationMinutes: {
    type: Number,
    min: 1,
    max: 480,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  startedAt: Date,
  endedAt: Date,
  status: {
    type: String,
    enum: ["created", "started", "ended"],
    default: "created",
  },
  participants: {
    interviewer: String,
    candidate: String,
  },
  notes: String,
  code: {
    type: String,
    default: "",
  },
  language: {
    type: String,
    enum: ["javascript", "python"],
    default: "javascript",
  },
});

export const Interview =
  mongoose.models.Interview || mongoose.model<IInterview>("Interview", InterviewSchema);
