import { AppDataSource } from "./data-source";
import * as express from "express";
import * as dotenv from "dotenv";
import * as cors from "cors";
import "reflect-metadata";
import { router } from "./routes/router";
dotenv.config();

const app = express();
app.use(express.json());
const { PORT = 3000 } = process.env;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use('/api', router);

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));