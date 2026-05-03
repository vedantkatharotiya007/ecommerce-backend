import User from "../models/user.js";
import Order from "../models/order.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { sendEmail } from "../config/mail.js";

export const getUsers = async (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;

  const data = await User.find()
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await User.countDocuments();
  res.json({ data, total });
};

export const deleteUser = async (req, res) => {
  const result = await User.deleteOne({ _id: req.body.id });
  res.json(result);
};
export const createUser = async (req, res) => {

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, password: hashedPassword });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user
    });

  } catch (error) {


    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];

      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }



};
export const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.identifier
    });
    let isMatch = false;

    if (user) {
      isMatch = await bcrypt.compare(req.body.password, user.password);
    }

    if (user && isMatch) {

      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );





console.log(user.role);

      

      res.json({
        success: true,
        message: "Login successful",
        token: token,
        role: user.role
      })





    } else {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }

};
var otp;
export const Sentotp = async (req, res) => {

  let user = await User.find({ email: req.body.email });

  try {
    otp = Math.floor(100000 + Math.random() * 900000).toString();

    let dat = Date.now();
    let ex = 5 * 60 * 1000 + dat;
    let user1 = await User.updateOne({ email: req.body.email }, { $set: { otp: otp, otpexpire: ex } })

    let b = await sendEmail({
      to: user[0].email,
      subject: "sending a otp for forgot password in my app ",
      html: `<h2>Your OTP is <b>${otp}</b></h2>`,
    });




    if (b) {
      res.json({
        success: true,
        message: "OTP sent to email"
      });
    }
    else {
      res.status(500).json({
        success: false,
        message: "OTP sent not to email network conection error"
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "user not found",
    });
  }

};
export const Resetpassword = async (req, res) => {
  try {
    let user1 = await User.findOne({ email: req.body.email })


    if (user1.otpexpire < Date.now() || user1.otp != req.body.otp) {
      res.status(501).json({
        success: false,
        message: "otp is expire or not valid",
      })

    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);


    let a = await User.updateOne({ email: req.body.email }, { $set: { password: hashedPassword, otp: "", otpexpire: "" } })
    if (a) {
      res.json({
        success: true,
        message: "paassword reset"
      });
    }

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    })
  }
};
export const getwishlist = async (req, res) => {
  try {


    let user1 = await User.findOne({ _id: req.user.id }).populate("wishlist")

    res.json({
      success: true,
      wishlist: user1.wishlist
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    })
  }
};
export const addwishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.body.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyExists = user.wishlist.some(
      (item) => item.toString() === productId
    );


    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }


    await User.updateOne(
      { _id: userId },
      { $push: { wishlist: productId } }
    );

    return res.status(200).json({
      success: true,
      message: "Product added to wishlist",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deletewishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.body.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    const alreadyExists = user.wishlist.some(
      (item) => item.toString() === productId
    );


    if (alreadyExists) {
      user.wishlist = user.wishlist.filter(
        (item) => item.toString() !== productId
      );
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Product removed from wishlist",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Product not in wishlist",
      });
    }


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getdashboard = async (req, res) => {
  try {
    let order = await Order.find({ user: req.user.id });
    let totalOrders = order.length;
    let totalAmount = order.reduce((sum, item) => sum + item.pricing.subtotal, 0);

    let wishlistCount = (await User.findById(req.user.id)).wishlist.length;
    let recentOrders = order.filter((o) => {
      const orderDate = new Date(o.createdAt);
      const currentDate = new Date();
      const timeDiff = currentDate - orderDate;
      return timeDiff <= 7 * 24 * 60 * 60 * 1000;
    });
    res.json({
      success: true,
      totalOrders,
      totalSpent: totalAmount,
      wishlistCount,
      recentOrders
    });


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getprofile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        username: user.username,
        mobile: user.mobile,
        createdAt: user.createdAt,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateprofile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { name, email, oldPassword, newPassword } = req.body;
    const existpassword = await bcrypt.compare(oldPassword, user.password);

    if (user) {
      if (newPassword && oldPassword) {
        if (!existpassword) {
          return res.status(400).json({
            success: false,
            message: "Old password is incorrect",
          });
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.password = await bcrypt.hash(newPassword, 10);
      }
      await user.save();
      res.json({
        success: true
      });

    } else {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
