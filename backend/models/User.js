// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String },
//     email: { type: String },
//     password: { type: String },
//     phone: { type: String },
//     address: { type: String },
//     role: { type: String, default: "customer" }, // customer | staff | admin
//   },
//   { timestamps: true }
// );

// export default mongoose.model("User", userSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ==============================
    // NAME
    // ==============================
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    // ==============================
    // EMAIL
    // ==============================
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        "Please enter a valid email address",
      ],
    },

    // ==============================
    // PASSWORD
    // ==============================
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 8 characters"],
      maxlength: [128, "Password cannot exceed 128 characters"],
      validate: {
        validator: function (value) {
          return (
            /[A-Za-z]/.test(value) && // at least one letter
            /\d/.test(value) && // at least one number
            /[^A-Za-z0-9]/.test(value) // at least one special character
          );
        },
        message:
          "Password must contain at least one letter, one number, and one special character",
      },
    },

    // ==============================
    // MOBILE NUMBER
    // ==============================
    phone: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      match: [
        /^[6-9]\d{9}$/,
        "Please enter a valid 10-digit Indian mobile number",
      ],
    },

    // ==============================
    // ADDRESS
    // ==============================
    address: {
      type: String,
      trim: true,
      maxlength: [250, "Address cannot exceed 250 characters"],
    },

    // ==============================
    // ROLE
    // ==============================
    role: {
      type: String,
      enum: {
        values: ["customer", "staff", "admin"],
        message: "Role must be customer, staff, or admin",
      },
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);