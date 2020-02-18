import path from 'path';
import { createLogger, transports, format } from 'winston';

// Request logger handler
const requestLoggerTransporter = new transports.Console();
const requestLoggerFormatter = format.printf(({ level, timestamp, message }) => (
  `${timestamp} ${level}: ${message}`
));
const requestLoggerLevel = 'info';
const createRequestLogger = () => {
  const logger = createLogger({
    level: requestLoggerLevel,
    format: format.combine(format.timestamp(), requestLoggerFormatter),
    transports: requestLoggerTransporter,
  });

  return (req, _res, next) => {
    const userAgent = req.header('user-agent');
    const host = req.header('host');
    logger.info(`${req.method} ${host}${req.originalUrl} - ${userAgent}`);
    return next();
  };
};

// Error logger handler
const errorLoggerTransporter = new transports.Console();
const errorLoggerFormatter = format.prettyPrint();
const errorLoggerLevel = 'error';
const createErrorLogger = () => (
  createLogger({
    level: errorLoggerLevel,
    format: format.combine(format.timestamp(), errorLoggerFormatter),
    transports: errorLoggerTransporter,
  })
);

// Added only in production environment
const errorLoggerFileTransporter = new transports.File({
  filename: path.join(path.dirname(__dirname), 'logs/error.log'),
  level: 'error',
});

const logger = {
  requestLogger: createRequestLogger(),
  errorLogger: createErrorLogger(),
  errorLoggerFileTransporter,
};

export default logger;
