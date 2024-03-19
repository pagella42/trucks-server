import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import inspections from "./inspections.js";

dotenv.config();

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(cors());
app.use(express.static("public"));
app.use(urlencodedParser);

app.use("/", inspections);

const PORT = process.env.PORT || 0; // Default to 3000 if PORT not set
app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

export default app;
