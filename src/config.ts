import { cleanEnv, str, num, bool } from 'envalid';
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
    MONGODB_URI: str({ default: 'mongodb://localhost:27017/tdd-api-demo' })
});

export default env;
