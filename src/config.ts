import { cleanEnv, str, num, bool, url } from 'envalid';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const env = cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
    PORT: num({ default: 3000 }),
    DATABASE_URL: str(),
    JWT_SECRET: str({ devDefault: 'unsafe_dev_secret' }),
    ENABLE_SWAGGER: bool({ default: false }),
    LOG_FORMAT: str({ choices: ['combined', 'dev', 'tiny', 'common'], default: 'dev' }),
    LOG_LEVEL: str({ choices: ['error', 'warn', 'info', 'verbose', 'debug', 'silly'], default: 'info' }),
    CORS_ORIGINS: str({ default: 'http://localhost:3000' }),
    LOGS_DIR: str({ default: path.join(__dirname, '../logs') }),
    MONGODB_URI: str({ default: 'mongodb://localhost:27017/tdd-api-demo' }),
    REDIS_HOST: str({default: 'localhost'}),
    REDIS_PORT: num({ default: 6379 }),
    REDIS_PASSWORD: str({ default: '' }),
    REDIS_URL: url({ default: 'redis://localhost:6379' }),
    RATE_LIMIT_REQUESTS: num({ default: 100 }),
    RATE_LIMIT_WINDOW_MS: num({ default: 60000 }),
    REDIS_TLS: bool({ default: false }),
});

export default env;
