import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let authHeader = req.headers.authorization;
const token = authHeader.split(" ")[1]; // destructure token
  if (!token) return new Response("Invalid token", { status: 401 });

 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Not authorized, token invalid",
    });
  }
};
export const adminOnly = (req, res, next) => {
console.log("admin");


  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access only",
    });
  }
  next();
};
