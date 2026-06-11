import mongoose, { Schema } from "mongoose";

const ImageSchema = new Schema(
  { url: String, layout: { type: String, enum: ["full", "half", "half-pair", "half-left", "half-right"], default: "full" }, order: { type: Number, default: 0 } },
  { _id: false }
);

const SectionSchema = new Schema(
  { subheading: { type: String, default: "" }, description: { type: String, default: "" } },
  { _id: false }
);

const ProjectDetailSchema = new Schema(
  {
    projectSlug: { type: String, required: true, unique: true },
    heading: { type: String, default: "" },
    subheading: { type: String, default: "" },
    bodyText: { type: String, default: "" },
    images: { type: [ImageSchema], default: [] },
    sections: { type: [SectionSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.ProjectDetail ?? mongoose.model("ProjectDetail", ProjectDetailSchema);
