import mongoose, { Schema } from "mongoose";

const CardSchema = new Schema({ index: String, title: String, bgClass: String, body: String }, { _id: false });

const CommunitySchema = new Schema({
  _id: { type: String, default: "community" },
  aboutTitle: { type: String, default: "" },
  aboutSubtitle: { type: String, default: "" },
  aboutBody: { type: String, default: "" },
  establishedYear: { type: String, default: "" },
  creativeStudio: { type: String, default: "" },
  cards: { type: [CardSchema], default: [] },
});

if (mongoose.models.Community) mongoose.deleteModel("Community");
export default mongoose.model("Community", CommunitySchema);
