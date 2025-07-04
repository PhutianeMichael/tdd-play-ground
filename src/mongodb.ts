import { MongoClient, Db } from 'mongodb';
import env from './config';
import { logger } from './server';

const uri = env.DATABASE_URL || 'mongodb://localhost:27017/tdd-api-demo';
let client: MongoClient;
let db: Db;

export async function connectToMongoDB() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
        db = client.db();
        logger.info('Connected to MongoDB');
    }
    return db;
}

export function getMongoDB(): Db {
    if (!db) {
        logger.error('MongoDB connection failed');
        throw new Error('MongoDB not connected!');
    }
    return db;
}

export async function closeMongoDB() {
    if (client) {
        await client.close();
        client = undefined as never;
        db = undefined as never;
        logger.info('MongoDB connection closed');
    }
}

