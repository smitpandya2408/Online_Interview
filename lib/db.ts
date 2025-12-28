import { MongoClient, type Collection } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || "interviewos";

if (!MONGODB_URI) {
  throw new Error("❌ Please define MONGODB_URI in .env.local");
}

declare global {
  // eslint-disable-next-line no-var
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global.mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI);
    global.mongoClientPromise = client.connect();
  }
  clientPromise = global.mongoClientPromise;
} else {
  const client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

/* ================= TYPES ================= */

export type DbUserRole = "admin" | "interviewer" | "candidate";

export type DbUser = {
  _id?: unknown;
  email: string;
  name?: string;
  passwordHash: string;
  role: DbUserRole;
  createdAt: Date;
};

export type DbInterviewStatus =
  | "scheduled"
  | "ongoing"
  | "completed"
  | "created"
  | "started"
  | "ended";

export type DbInterview = {
  _id?: unknown;
  roomId: string;
  title?: string;
  candidateName?: string;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  status: DbInterviewStatus;
  participants?: {
    interviewer?: string;
    candidate?: string;
  };
  notes?: string;
  rating?: number;
  code?: string;
  language?: "javascript" | "python";
};

export type DbMessage = {
  _id?: unknown;
  roomId: string;
  sender: string;
  text: string;
  createdAt: Date;
};

export type DbCodeSnapshot = {
  _id?: unknown;
  roomId: string;
  code: string;
  language: "javascript" | "python";
  createdAt: Date;
  clientId?: string;
};

export type MongoCollections = {
  Users: Collection<DbUser>;
  Interviews: Collection<DbInterview>;
  Messages: Collection<DbMessage>;
  CodeSnapshots: Collection<DbCodeSnapshot>;
};

/* ================= MAIN EXPORT ================= */

export async function getMongoCollections(): Promise<MongoCollections> {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  return {
    Users: db.collection<DbUser>("Users"),
    Interviews: db.collection<DbInterview>("Interviews"),
    Messages: db.collection<DbMessage>("Messages"),
    CodeSnapshots: db.collection<DbCodeSnapshot>("CodeSnapshots"),
  };
}
