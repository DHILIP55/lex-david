import mongoose, { Schema } from "mongoose";

const ServicesConfigSchema = new Schema({
  _id: { type: String, default: "services-config" },
  sectionLabel: { type: String, default: "" },
  sectionHeading: { type: String, default: "" },
});

export default mongoose.models.ServicesConfig ?? mongoose.model("ServicesConfig", ServicesConfigSchema);
