import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

async function startServer() {
  await connectDatabase();

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`OnlineVac API listening on port ${env.port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start OnlineVac API', error);
  process.exit(1);
});
