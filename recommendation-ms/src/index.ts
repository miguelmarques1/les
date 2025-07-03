import * as express from "express";
import * as dotenv from "dotenv";
import * as cors from "cors";
import "reflect-metadata";
import { router } from "./routes/router";
dotenv.config();

const app = express();
app.use(express.json());
const { PORT = 3003 } = process.env;

app.use(cors({
    origin: "*",
    methods: ["POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(router);

app.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);
});