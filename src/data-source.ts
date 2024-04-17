import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
dotenv.config();

import { User } from "./entity/User";

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST ? DB_HOST : 'localhost',
    port: DB_PORT ? Number.parseInt(DB_PORT) : 5432,
    username: DB_USERNAME ? DB_USERNAME : 'postgres',
    password: DB_PASSWORD ? DB_PASSWORD : '123456',
    database: DB_NAME ? DB_NAME : 'EUCare',
    synchronize: true,
    logging: false,      //logging logs sql command on the terminal
    entities: [User],
    migrations: [`${__dirname}/migration/*.ts`],
    subscribers: [],
});
