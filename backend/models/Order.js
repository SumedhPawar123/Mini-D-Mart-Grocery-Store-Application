import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: { type: String },
  price: { type: Number },
  quantity: { type: Number },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [orderItemSchema],
    totalAmount: { type: Number },
    fulfillmentType: { type: String, default: "pickup" }, // pickup | delivery
    scheduledDate: { type: Date },
    deliveryAddress: { type: String },
    status: {
      type: String,
      default: "pending", // pending | confirmed | preparing | ready | out_for_delivery | delivered | cancelled
    },
    paymentStatus: { type: String, default: "unpaid" }, // unpaid | paid
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
