import express from "express";
import { createServer } from "http";
import chatRouter from "./routes/chat.router";
import { json } from "body-parser";
import cors from "cors";
import { Server } from "socket.io";
import { gptSocket } from "./controllers/socket.controller";
import { errorMiddleware } from "./middleware/error.middleware";
import { chatEventHandler } from "./controllers/event.controller";

const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on("connection", gptSocket);

app.use(json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(chatRouter);

app.use(errorMiddleware);

server.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
