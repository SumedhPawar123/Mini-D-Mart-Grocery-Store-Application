import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// @desc Create order from cart (checkout)
// @route POST /api/orders
export const createOrder = async (req, res) => {
  const { fulfillmentType, scheduledDate, deliveryAddress } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  // basic stock check
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      return res.status(400).json({
        message: `Insufficient stock for ${item.product.name}`,
      });
    }
  }

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
  }));

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalAmount,
    fulfillmentType,
    scheduledDate,
    deliveryAddress,
    status: "pending",
  });

  // reduce stock
  for (const item of cart.items) {
    item.product.stock -= item.quantity;
    await item.product.save();
  }

  // clear cart
  cart.items = [];
  await cart.save();

  res.status(201).json(order);
};

// @desc Get logged in user's orders
// @route GET /api/orders/my
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

// @desc Get all orders (staff/admin)
// @route GET /api/orders
export const getAllOrders = async (req, res) => {
  const { status, fulfillmentType } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (fulfillmentType) filter.fulfillmentType = fulfillmentType;

  const orders = await Order.find(filter)
    .populate("user", "name email phone")
    .sort({ createdAt: -1 });
  res.json(orders);
};

// @desc Get single order
// @route GET /api/orders/:id
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email phone");
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
};

// @desc Update order status (staff/admin)
// @route PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = status;
  const updated = await order.save();
  res.json(updated);
};

// @desc Cancel order (customer, only if not yet shipped/delivered)
// @route PUT /api/orders/:id/cancel
export const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (["out_for_delivery", "delivered", "cancelled"].includes(order.status)) {
    return res.status(400).json({ message: `Order cannot be cancelled at status: ${order.status}` });
  }

  order.status = "cancelled";
  await order.save();

  // restock items
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock += item.quantity;
      await product.save();
    }
  }

  res.json(order);
};
