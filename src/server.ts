import "reflect-metadata";
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { json } from 'body-parser';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import env from './config';
import path from 'path';
import { connectToMongoDB, closeMongoDB } from './mongodb';

const app = express();

// ======================
// Winston Configuration
// ======================
const logger = createLogger({
    level: env.LOG_LEVEL,
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.printf(({ timestamp, level, message, ...meta }) => {
                    return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
                })
            ),
        }),
        new DailyRotateFile({
            filename: path.join(env.LOGS_DIR, 'application-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: format.combine(
                format.timestamp(),
                format.json()
            )
        })
    ]
});

// ======================
// Swagger Configuration (Conditional)
// ======================
let swaggerSpec = null;
if (env.ENABLE_SWAGGER) {
    swaggerSpec = swaggerJSDoc({
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'API Documentation',
                version: '1.0.0',
                description: 'API documentation for your application'
            },
            servers: [{ url: `http://localhost:${env.PORT}` }],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                    }
                }
            }
        },
        apis: ['./src/routes/*.ts']
    });
}

// ======================
// Middleware
// ======================
// CORS (Environment-Aware)
app.use(cors({
    origin: env.CORS_ORIGINS.split(',').map(origin => origin.trim()),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: env.NODE_ENV === 'production' ? undefined : false
}));

// Standard Middleware
app.use(json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Performance Middleware
app.use(compression());

// Logging Middleware

// ======================
// Routes
// ======================
// Swagger UI Route (Conditional)
if (env.ENABLE_SWAGGER) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    logger.info(`Swagger UI available at /api-docs`);
}


// ======================
// Error Handling
// ======================
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

app.use((err: Error, req: express.Request, res: express.Response) => {
    logger.error('Server error', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });
    res.status(500).json({ error: 'Internal Server Error' });
});

// ======================
// Server Initialization
// ======================
async function startServer() {
    try {
        await connectToMongoDB();
        const server = app.listen(env.PORT, () => {
            logger.info(`Server started`, {
                port: env.PORT,
                environment: env.NODE_ENV,
                node_version: process.version
            });
        });

        // Handle shutdown gracefully
        process.on('SIGTERM', async () => {
            logger.info('SIGTERM received. Shutting down gracefully...');
            server.close(async () => {
                await closeMongoDB();
                logger.info('Server closed');
                process.exit(0);
            });
        });
    } catch (err) {
        logger.error('Failed to connect to MongoDB', { error: err });
        process.exit(1);
    }
}

startServer();

export { app, logger };
