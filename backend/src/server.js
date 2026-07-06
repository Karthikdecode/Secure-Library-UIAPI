import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './lib/db.js';
import { logger } from './config/logger.js';

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(env.port, () => {
      logger.info(`Secure Library API listening on port ${env.port}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
