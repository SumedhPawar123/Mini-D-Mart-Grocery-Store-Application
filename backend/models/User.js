import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    phone: { type: String },
    address: { type: String },
    role: { type: String, default: "customer" }, // customer | staff | admin
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
