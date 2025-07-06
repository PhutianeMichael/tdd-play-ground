import { MongoClient, Db } from 'mongodb';
import env from './config';
import { logger } from './server';
import { MongoMemoryServer } from 'mongodb-memory-server';

const uri = env.DATABASE_URL || 'mongodb://localhost:27017/tdd-api-demo';
let client: MongoClient;
let db: Db;
let mongod: MongoMemoryServer | undefined;

export async function connectToMongoDB() {
    if (process.env.NODE_ENV === 'test') {
        if (!mongod) {
            mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            client = new MongoClient(uri);
            await client.connect();
            db = client.db();
            logger.info('Connected to in-memory MongoDB');
        }
        return db;
    }
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
    if (process.env.NODE_ENV === 'test' && mongod) {
        await client?.close();
        await mongod.stop();
        client = undefined as never;
        db = undefined as never;
        mongod = undefined;
        logger.info('In-memory MongoDB connection closed');
        return;
    }
    if (client) {
        await client.close();
        client = undefined as never;
        db = undefined as never;
        logger.info('MongoDB connection closed');
    }
}
