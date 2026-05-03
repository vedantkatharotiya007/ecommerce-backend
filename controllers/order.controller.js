import Order from "../models/order.js";
import { sendEmail } from "../config/mail.js";
import cart from "../models/cart.js";
import PDFDocument from "pdfkit";
import { io } from "../server.js";


export const getOrders = async (req, res) => {
  try {
    let status = req.query.status;
    let page = req.query.page || 1;
    let limit = req.query.limit || 10;

console.log(" i call");

console.log(status+page+limit);

    if (status == "All") {
      const orders = await Order.find({}).populate("user", "name email").skip((page - 1) * limit).limit(limit);


      return res.json({ orders, totalPages: orders.length });
    }
    if (status) {
      const orders = await Order.find({ orderStatus: status }).populate("user", "name email").skip((page - 1) * limit).limit(limit);

      return res.json({ orders, totalPages: orders.length });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });


  }
};
export const getOrdersuser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
  

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getOrderuser = async (req, res) => {
  try {
    const orders = await Order.findOne({ _id: req.params.id });

    const userid = req.user.id;

    const cartdata = await cart.findOne({ user: userid });

    if (!orders || !cartdata) {
      return res.status(404).json({ message: "Order or cart not found" });
    }

    const orderProductIds = orders.items
      .filter(item => item.product)
      .map(item => item.product.toString());

    cartdata.items = cartdata.items.filter(
      item => !orderProductIds.includes(item.product.toString())
    );

    await cartdata.save();
console.log("i am call");

io.to("adminRoom").emit("Updatedadmin", {
  orderId: orders._id,
  userId: req.user.id, // optional
});
  // console.log(orders);
  res.json({ orders });
  
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const pdf = async (req, res) => {
  try {
    const orderId = req.params?.id;


    const order = await Order.findById(orderId);


    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order._id}.pdf`
    );

    doc.pipe(res);


    doc.fontSize(20).text("INVOICE", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`Status: ${order.paymentInfo.status}`);
    doc.moveDown();

    doc.text("Items:");
    order.items.forEach((item) => {
      doc.text(
        `${item.name} × ${item.quantity} - ₹${item.price * item.quantity}`
      );
    });

    doc.moveDown();
    doc.text(`Total: ₹${order.pricing.total}`);

    doc.end();
  } catch (error) {

    res.status(500).json({ message: "PDF generation failed" });
  }
};




export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;


    let order = await Order.find({ _id: req.params.id }).populate("user", "name email");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order[0].orderStatus = status;




    await order[0].save();


    await sendEmail({
      to: order[0].user.email,
      subject: "Order status updated 🎉",
      html: `<h2>Your order status is now <b>${order[0].orderStatus}</b></h2>`,
    });

  io.to(`user_${order[0].user._id}`).emit("orderUpdated", {
    orderId: order[0]._id,
    status: order[0].orderStatus,
  });

console.log(`user_${order[0].user._id}`);


    res.json({
      message: "Order updated & email sent",
      order,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });


  }
};
export const getOrderDetails = async (req, res) => {
  try {


    const order = await Order.findById(req.params.id).populate("user", "name email");


    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};