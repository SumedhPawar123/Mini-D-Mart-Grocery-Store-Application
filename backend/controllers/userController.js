import User from "../models/User.js";

// @desc Get all users (admin only)
// @route GET /api/users
export const getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// @desc Update a user's role (admin only)
// @route PUT /api/users/:id/role
export const updateUserRole = async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.role = role;
  const updated = await user.save();
  res.json(updated);
};

// @desc Delete a user (admin only)
// @route DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  await user.deleteOne();
  res.json({ message: "User removed" });
};
