import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    coverImageUrl: { type: String, default: "" },
    gridLayout: { type: String, default: "full" },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    category: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development") {
  delete mongoose.models["Project"];
}
const Project = mongoose.models.Project ?? mongoose.model("Project", ProjectSchema);
export default Project;
