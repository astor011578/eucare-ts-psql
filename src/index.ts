import "reflect-metadata";
import * as express from "express";
import * as path from "path";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { config as envConfig } from "dotenv";
const envPath = path.resolve(__dirname, "..", "config.env");
envConfig({ path: envPath });

import { getEnv } from "./utils/env-variables";
import { userRouter } from "./routes/user";
import { patientRouter } from "./routes/patient";
import { appointmentRouter } from "./routes/appointment";

const app = express();
app.use(express.json());
app.use("/user", userRouter);
app.use("/patients", patientRouter);
app.use("/appointment", appointmentRouter);

const errorHandler = (error: Error, req: Request, res: Response) => {
    console.error(`Error: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
};
app.use(errorHandler);

AppDataSource.initialize()
    .then(async () => {
        console.log("Database connected successfully");
    })
    .catch(error => {
        console.error(error);
    });

app.get("*", (req: Request, res: Response) => {
    res.status(400).json({ message: "Bad request" });
});

const PORT = getEnv("PORT");
const appPort: number = PORT ? Number.parseInt(PORT) : 3000;
app.listen(appPort, () => {
    console.log(`Server is running on port ${appPort}`);
});
