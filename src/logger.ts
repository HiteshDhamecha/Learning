import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => `${timestamp} - ${level.toUpperCase()}: ${message}`)
  ),
  transports: [
      new winston.transports.File({ filename: 'api_logs.txt' }),  // Log to a file
      new winston.transports.Console()  // Also log to the console
  ]
});

export {logger}