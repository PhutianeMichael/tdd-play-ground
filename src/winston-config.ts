import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import env from './config';

const { combine, timestamp, json, colorize, simple } = winston.format;

export const logger = winston.createLogger({
    level: env.LOG_LEVEL,
    format: combine(
        timestamp(),
        json()
    ),
    transports: [
        new winston.transports.Console({
            format: combine(
                colorize(),
                simple()
            )
        }),
        new DailyRotateFile({
            filename: path.join(__dirname, '../logs/application-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        })
    ]
});
