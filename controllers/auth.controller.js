import jwt from "jsonwebtoken";

export const googleAuthSuccess = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.redirect(`${process.env.clienturl}/login`);
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );


    
      


res.redirect(`${process.env.clienturl}/login/callback?token=${token}&role=${user.role}`);
  } catch (error) {

    return res.redirect(`${process.env.clienturl}/login`);
  }
};
