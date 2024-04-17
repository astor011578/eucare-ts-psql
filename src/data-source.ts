import "reflect-metadata";
import { DataSource } from "typeorm";
import { getEnv } from './utils/env-variables';
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
    synchronize: false,
    logging: false,      //logging logs sql command on the terminal
    entities: [`${__dirname}/**/*.entity{.ts,.js}`],
    migrations: [`${__dirname}/migration/*.ts`],
    subscribers: [],
});
