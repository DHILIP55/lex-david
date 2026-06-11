import mongoose, { Schema } from "mongoose";

const FaqConfigSchema = new Schema({
  _id: { type: String, default: "faq-config" },
  sectionLabel: { type: String, default: "" },
  sectionHeading: { type: String, default: "" },
});

export default mongoose.models.FaqConfig ?? mongoose.model("FaqConfig", FaqConfigSchema);
