import { app } from "./app.mjs";
import logger from "./constants/logger.mjs";

async function start() {
  app.listen(process.env.PORT || 8080, async () => {
    logger.info("Server is up and running on port " + (process.env.PORT || 8080));
  });
}

start();
