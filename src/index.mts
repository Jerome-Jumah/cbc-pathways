import { app } from "./app.mjs";
import logger from "./constants/logger.mjs";
import { env } from "./config/env.mjs";
import { prisma } from "./db/client.mjs";

async function start() {
  const server = app.listen(env.PORT, () => {
    logger.info(`Server is up and running on port ${env.PORT}`);
  });

  const shutdown = async (signal: NodeJS.Signals) => {
    logger.info(`Received ${signal}. Shutting down gracefully.`);
    server.close(async error => {
      if (error) {
        logger.error("Error while closing HTTP server", { error });
        process.exitCode = 1;
      }

      await prisma.$disconnect();
      process.exit();
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

start().catch(error => {
  logger.error("Failed to start server", { error });
  process.exit(1);
});
