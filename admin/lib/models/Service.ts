import mongoose, { Schema } from "mongoose";

const ServiceSchema = new Schema(
  {
    order: { type: Number, default: 0 },
    index: { type: String, default: "" },
    title: { type: String, required: true },
    tags: { type: [String], default: [] },
    description: { type: String, default: "" },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Service ?? mongoose.model("Service", ServiceSchema);
