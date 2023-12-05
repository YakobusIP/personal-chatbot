import express from "express";
import { createServer } from "http";
import chatRouter from "./routes/chat.router";
import { json } from "body-parser";
import cors from "cors";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

const server = createServer(app);

app.use(json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use("/chat", chatRouter);

app.use(errorMiddleware);

server.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
