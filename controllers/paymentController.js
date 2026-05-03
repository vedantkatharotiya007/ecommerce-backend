import Stripe from "stripe";

import Order from "../models/order.js";
import address from "../models/address.js";




export const webhook = async (req, res) => {

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const sig = req.headers["stripe-signature"];
console.log("i am call");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {

    return res.status(400).send(`Webhook Error: ${err.message}`);
  }


  if (event.type === "checkout.session.completed") {

    const session = event.data.object;
    const orderId = session.metadata.orderId;
console.log("here");

    await Order.findByIdAndUpdate(orderId, {
      "paymentInfo.paymentId": session.payment_intent,
      "paymentInfo.sessionId": session.id,
      "paymentInfo.status": "Paid",
      orderStatus: "Confirmed"
    });


  }

  res.json({ received: true });
}




export const createCheckoutSession = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const { items, addressId } = req.body;
    const userId = req.user.id;
    if (!req.body.addressId) {
      return res.status(400).json({
        message: "Shipping address is required"
      });
    }

    const addressData = await address.findOne({ user: userId });


    const selectedAddress = addressData.addresses.find(addr => addr._id.toString() === addressId);


    const order = await Order.create({
      user: userId,
      items: items.map(item => ({
        product: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),

      shippingAddress: selectedAddress,
      pricing: {
        subtotal: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        tax: 0,
        shipping: 0,
        total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      },
      paymentInfo: {
        status: "Pending"
      },
      orderStatus: "Pending"
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map(item => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.clienturl}/user/component/success?orderId=${order._id}`,
      cancel_url: `${process.env.clienturl}/cancel`,
      metadata: {
        orderId: order._id.toString()
      }
    });
    res.json({ url: session.url });






  } catch (error) {
    res.status(500).json({ message: "Stripe error" });


  }
};
