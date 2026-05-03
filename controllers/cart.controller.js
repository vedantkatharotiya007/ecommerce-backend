import cart from "../models/cart.js";
export const createcart = async (req, res) => {

  let pid = req.body.pid
  let qua = req.body.quantity
  let a1 = await cart.findOne({ user: req.user.id });


  if (!a1) {
    a1 = new cart({
      user: req.user.id,
      items: [],
    });


  }
  const itemIndex = a1.items.findIndex(
    item => item.product.toString() === req.body.pid
  );

  if (itemIndex > -1) {
    a1.items[itemIndex].quantity += req.body.quantity;
  } else {
    a1.items.push({
      product: pid,
      quantity: qua
    });
  }

  await a1.save();

  res.json({ cart });

};

export const fetchcart = async (req, res) => {
  const cart1 = await cart.findOne({ user: req.user.id }).populate("items.product", "productName price productimage _id");
  res.status(200).json({ cart1 });

};
export const updatecart = async (req, res) => {
  try {


    const { pid, action } = req.body;


    const cart1 = await cart.findOne({ user: req.user.id });

    if (!cart1) {
      return res.status(404).json({ message: "Cart not found" });
    }


    const item = cart1.items.find(
      item => item.product.toString() === pid
    );


    if (!item) {
      return res.status(404).json({ message: "Product not in cart" });
    }


    if (action === "inc") {
      item.quantity += 1;
    }

    if (action === "dec") {
      item.quantity -= 1;

      if (item.quantity <= 0) {
        cart1.items = cart1.items.filter(
          item => item.product.toString() !== pid
        );
      }
    }

    await cart1.save();

    res.status(200).json(cart1);

  } catch (error) {

    res.status(500).json({ message: "Server Error" });
  }
};

export const deletecart = async (req, res) => {
  try {
    const cart1 = await cart.findOne({ user: req.user.id });
    cart1.items = cart1.items.filter(
      item => item.product.toString() !== req.body?.pid
    );
    await cart1.save();

    res.status(200).json(cart1);


  } catch (error) {

    res.status(500).json({ message: "Server Error" });
  }
};
