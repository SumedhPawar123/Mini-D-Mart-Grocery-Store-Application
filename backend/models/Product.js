import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
    price: { type: Number },
    image: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    stock: { type: Number, default: 0 },
    unit: { type: String, default: "pcs" }, // e.g. kg, ltr, pcs
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
