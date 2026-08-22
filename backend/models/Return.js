import mongoose from "mongoose";

const returnSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, default: 1 },
    type: { type: String, default: "return" }, // return | exchange
    reason: { type: String },
    status: { type: String, default: "requested" }, // requested | approved | rejected | completed
  },
  { timestamps: true }
);

export default mongoose.model("Return", returnSchema);
