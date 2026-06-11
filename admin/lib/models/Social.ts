import mongoose, { Schema } from "mongoose";

const SocialItemSchema = new Schema(
  { label: String, value: String, order: { type: Number, default: 0 } },
  { _id: false }
);

const SocialSchema = new Schema({
  _id: { type: String, default: "social" },
  items: { type: [SocialItemSchema], default: [] },
});

export default mongoose.models.Social ?? mongoose.model("Social", SocialSchema);
