import { Schema, model } from "mongoose";

interface Job {
  name: string;
}

const schema = new Schema<Job>({
  name: { type: String, required: true, unique: true },
});

export const JobModel = model<Job>("Job", schema);
