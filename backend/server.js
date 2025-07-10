import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectionDB from "./config/dbConnection.js";
import taskRoute from "./routes/taskRoute.js";
import userRoute from "./routes/userRoute.js";
import actionLogRoute from "./routes/actionLogRoute.js";
import { Server } from "socket.io";
import { setupSocket } from "./socket/index.js";
import http from "http";

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
  "https://to-do-board-sage.vercel.app",
  "http://localhost:5173",
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

// connecting with database
connectionDB();

// Routes
app.use("/api/user", userRoute);
app.use("/api/tasks", taskRoute);
app.use("/api/actions", actionLogRoute);

// HTTP and webSocket server

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Setup Socket.Io logic
setupSocket(io);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} `);
});
