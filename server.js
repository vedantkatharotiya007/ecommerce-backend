import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

console.log("Stripe Key:", process.env.STRIPE_SECRET_KEY);

dotenv.config();

console.log("SERVER CLIENT ID:", process.env.GOOGLE_CLIENT_ID);

import app from "./app.js";
await import("./config/passport.js");

const PORT = 3000;
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
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Socket.IO is active and listening for connections`);
});
