import { createLogger, transports, format } from 'winston';

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

const logger = {
  requestLogger: createRequestLogger(),
};

export default logger;
