// Simple seed script — run with: node seed/seed.js
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

dotenv.config();

const run = async () => {
  await connectDB();

  await User.deleteMany();
  await Category.deleteMany();
  await Product.deleteMany();

  const password = await bcrypt.hash("password123", 10);

  await User.create([
    { name: "Admin User", email: "admin@dmart.com", password, role: "admin" },
    { name: "Staff User", email: "staff@dmart.com", password, role: "staff" },
    { name: "Customer User", email: "customer@dmart.com", password, role: "customer" },
  ]);

  const categories = await Category.create([
    { name: "Fruits & Vegetables" },
    { name: "Dairy & Bakery" },
    { name: "Snacks & Beverages" },
  ]);

  await Product.create([
    { name: "Banana", price: 40, stock: 100, unit: "kg", category: categories[0]._id, description: "Fresh bananas" },
    { name: "Tomato", price: 30, stock: 100, unit: "kg", category: categories[0]._id, description: "Fresh tomatoes" },
    { name: "Milk 1L", price: 60, stock: 50, unit: "ltr", category: categories[1]._id, description: "Toned milk" },
    { name: "Bread", price: 45, stock: 40, unit: "pcs", category: categories[1]._id, description: "Whole wheat bread" },
    { name: "Potato Chips", price: 20, stock: 80, unit: "pcs", category: categories[2]._id, description: "Salted chips" },
    { name: "Orange Juice 1L", price: 90, stock: 30, unit: "ltr", category: categories[2]._id, description: "100% real juice" },
  ]);

  console.log("Seed data inserted!");
  console.log("Login credentials:");
  console.log("  admin@dmart.com / password123");
  console.log("  staff@dmart.com / password123");
  console.log("  customer@dmart.com / password123");
  process.exit();
};

run();
