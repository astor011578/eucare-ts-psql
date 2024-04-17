import "reflect-metadata";
import * as express from "express";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
// import { userRouter } from "./route/user";
dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT;
// app.use('/user', userRouter);

const errorHandler = (error: Error, req: Request, res: Response) => {
    console.error(`Error: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
};
app.use(errorHandler);

app.get("*", (req: Request, res: Response) => {
    res.status(505).json({ message: "Bad request" });
});

AppDataSource.initialize().then(async () => {
    const appPort: number = PORT ? Number.parseInt(PORT) : 3000;
    app.listen(appPort, () => {
        console.log(`Server is running on port ${appPort}`);
    });
    console.log("Data source has been initialized.");
}).catch(error => console.error(error));
