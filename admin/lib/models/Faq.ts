import mongoose, { Schema } from "mongoose";

const FaqItemSchema = new Schema({ question: String, answer: String, order: { type: Number, default: 0 } }, { _id: false });

const FaqSchema = new Schema(
  {
    categoryName: { type: String, required: true },
    order: { type: Number, default: 0 },
    items: { type: [FaqItemSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Faq ?? mongoose.model("Faq", FaqSchema);
