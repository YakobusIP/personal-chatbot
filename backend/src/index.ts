import express, { Application } from "express";
import { json } from "body-parser";
import cors from "cors";
import chatRouter from "./routes/chat.router";
import { errorMiddleware } from "./middleware/error.middleware";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setMiddlewares();
    this.setRoutes();
    this.setErrorMiddleware();
  }

  private setMiddlewares(): void {
    this.app.use(cors({ origin: "http://localhost:5173" }));
    this.app.use(json());
  }

  private setRoutes(): void {
    this.app.use("/chat", chatRouter);
  }

  private setErrorMiddleware(): void {
    this.app.use(errorMiddleware);
  }
}

const PORT = process.env.PORT || 4000;
const { app } = new App();

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
