import mongoose, { Schema } from "mongoose";

const HeroSchema = new Schema({
  _id: { type: String, default: "hero" },
  words: { type: [String], default: [] },
  backgroundType: { type: String, enum: ["image", "slideshow", "video"], default: "image" },
  backgroundImageUrl: { type: String, default: "" },
  backgroundImages: { type: [String], default: [] },
  backgroundVideoUrl: { type: String, default: "" },
});

// Delete the cached model so schema additions are always picked up after hot reload
if (mongoose.models.Hero) mongoose.deleteModel("Hero");
export default mongoose.model("Hero", HeroSchema);
