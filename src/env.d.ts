declare namespace NodeJS {
    interface ProcessEnv {
        PORT: number;
        DATABASE_URL: string;
        JWT_SECRET: string;
        NODE_ENV: 'development' | 'production' | 'test';
        CORS_ORIGINS: string;
        ENABLE_SWAGGER: true | false;
        LOG_FORMAT: 'combined' | 'dev' | 'tiny' | 'common';
        LOG_LEVEL: 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';
    }
}
