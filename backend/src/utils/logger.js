const LOG_LEVELS = {
  info: '\x1b[36m[INFO]\x1b[0m',
  warn: '\x1b[33m[WARN]\x1b[0m',
  error: '\x1b[31m[ERROR]\x1b[0m',
  debug: '\x1b[35m[DEBUG]\x1b[0m',
};

const timestamp = () => new Date().toISOString();

const logger = {
  info: (msg, ...args) =>
    console.log(`${LOG_LEVELS.info} ${timestamp()}: ${msg}`, ...args),
  warn: (msg, ...args) =>
    console.warn(`${LOG_LEVELS.warn} ${timestamp()}: ${msg}`, ...args),
  error: (msg, ...args) =>
    console.error(`${LOG_LEVELS.error} ${timestamp()}: ${msg}`, ...args),
  debug: (msg, ...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${LOG_LEVELS.debug} ${timestamp()}: ${msg}`, ...args);
    }
  },
};

module.exports = { logger };
