import { DataSource } from "typeorm";
import env from '../config';

export const dataSource = new DataSource({
    type: "mongodb",
    url: env.DATABASE_URL,
    entities: [

    ],
    synchronize: env.NODE_ENV !== 'production', // Only sync in development
});
