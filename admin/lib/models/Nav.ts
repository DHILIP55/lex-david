import mongoose, { Schema } from "mongoose";

const NavItemSchema = new Schema(
  {
    order: { type: Number, default: 0 },
    prefixLabel: { type: String, default: "" },
    label: { type: String, required: true },
    type: { type: String, enum: ["link", "scroll"], default: "link" },
    target: { type: String, required: true },
  },
  { _id: false }
);

const FooterLinkSchema = new Schema(
  { label: { type: String, default: "" }, order: { type: Number, default: 0 } },
  { _id: false }
);

const SocialLinkSchema = new Schema(
  { label: { type: String, default: "" }, url: { type: String, default: "" }, order: { type: Number, default: 0 } },
  { _id: false }
);

const NavSchema = new Schema({
  _id: { type: String, default: "nav" },
  logoUrl: { type: String, default: "" },
  items: { type: [NavItemSchema], default: [] },
  mobileFooterLinks: { type: [FooterLinkSchema], default: [] },
  socialLinks: { type: [SocialLinkSchema], default: [] },
});

if (process.env.NODE_ENV === "development") {
  delete mongoose.models["Nav"];
}
export default mongoose.models.Nav ?? mongoose.model("Nav", NavSchema);
