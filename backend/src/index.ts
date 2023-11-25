import express from "express";
import { createServer } from "http";
import { WebSocket } from "ws";
import router from "./routes/chat.router";

const app = express();

const server = createServer(app);

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (message: string) => {
    console.log(`Received: ${message}`);
    ws.send(`Hello, you send ${message}`);
  });

  ws.send("Connection successful");
});

app.use(router);

server.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
