import Return from "../models/Return.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// @desc Create return/exchange request (only for delivered/ready orders)
// @route POST /api/returns
export const createReturn = async (req, res) => {
  const { orderId, productId, quantity, type, reason } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (order.status !== "delivered" && order.status !== "ready") {
    return res.status(400).json({
      message: "Return/exchange only allowed for completed orders",
    });
  }

  const returnRequest = await Return.create({
    order: orderId,
    user: req.user._id,
    product: productId,
    quantity,
    type,
    reason,
    status: "requested",
  });

  res.status(201).json(returnRequest);
};

// @desc Get logged in user's return requests
// @route GET /api/returns/my
export const getMyReturns = async (req, res) => {
  const returns = await Return.find({ user: req.user._id })
    .populate("product", "name price")
    .sort({ createdAt: -1 });
  res.json(returns);
};

// @desc Get all return requests (staff/admin)
// @route GET /api/returns
export const getAllReturns = async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const returns = await Return.find(filter)
    .populate("product", "name price")
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(returns);
};

// @desc Approve or reject a return request (staff/admin)
// @route PUT /api/returns/:id/status
export const updateReturnStatus = async (req, res) => {
  const { status } = req.body; // approved | rejected | completed
  const returnRequest = await Return.findById(req.params.id);
  if (!returnRequest) return res.status(404).json({ message: "Return request not found" });

  returnRequest.status = status;
  await returnRequest.save();

  // when a return (not exchange) is completed, add stock back
  if (status === "completed" && returnRequest.type === "return") {
    const product = await Product.findById(returnRequest.product);
    if (product) {
      product.stock += returnRequest.quantity;
      await product.save();
    }
  }

  res.json(returnRequest);
};
