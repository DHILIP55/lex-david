import mongoose, { Schema } from "mongoose";

const AnalyticsSchema = new Schema(
  {
    event: { type: String, enum: ["pageview", "click", "timespent"], required: true },
    url: { type: String, default: "/" },
    sessionId: { type: String, required: true },
    value: { type: Number, default: 1 },
    meta: { type: String, default: "" },
  },
  { timestamps: true }
);

AnalyticsSchema.index({ event: 1, createdAt: -1 });
AnalyticsSchema.index({ sessionId: 1 });

if (process.env.NODE_ENV === "development") {
  delete mongoose.models["Analytics"];
}
export default mongoose.models.Analytics ?? mongoose.model("Analytics", AnalyticsSchema);
