import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, ".env") });


console.log("Stripe Key:", process.env.STRIPE_SECRET_KEY);

    console.log("url is", process.env.MONGO_URI);

console.log("SERVER CLIENT ID:", process.env.GOOGLE_CLIENT_ID);

import connectDB from "./config/db.js";

connectDB();
import app from "./app.js";
await import("./config/passport.js");

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin:"http://localhost:3002",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", ({ userId, role }) => {
    if (!userId) return;

    // All users join their personal room
    socket.join(`user_${userId}`);
    console.log(`User joined room user_${userId}`);

    // Admins also join shared admin room
    if (role === "admin") {
      socket.join("adminRoom");
      console.log(`Admin ${userId} joined adminRoom`);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
export { io };
// Change 'app.listen' to 'server.listen'
server.listen(PORT, () => {
  const host = process.env.RENDER_EXTERNAL_URL || "localhost";

  console.log("==================================");
  console.log("🚀 SERVER RUNNING");
  console.log(`🌐 URL: ${host}:${PORT}`);
  console.log("==================================");
});
