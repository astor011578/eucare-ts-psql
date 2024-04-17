import "reflect-metadata";
import { DataSource } from "typeorm";
import { getEnv } from './util/env-variables';
import { User } from "./entity/User";

const DB_HOST: string | undefined = getEnv('DB_HOST');
const DB_PORT: string | undefined = getEnv('DB_PORT');
const DB_USERNAME: string | undefined = getEnv('DB_USERNAME');
const DB_PASSWORD: string | undefined = getEnv('DB_PASSWORD');
const DB_NAME: string | undefined = getEnv('DB_NAME');

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST ? DB_HOST : 'localhost',
    port: DB_PORT ? Number.parseInt(DB_PORT) : 5432,
    username: DB_USERNAME ? DB_USERNAME : 'postgres',
    password: DB_PASSWORD ? DB_PASSWORD : 'postgres',
    database: DB_NAME ? DB_NAME : 'EUCare',
    synchronize: true,
    logging: false,      //logging logs sql command on the terminal
    entities: [User],
    migrations: [`${__dirname}/migration/*.ts`],
    subscribers: [],
});
