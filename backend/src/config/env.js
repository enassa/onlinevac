import dotenv from 'dotenv';

dotenv.config();

const requiredEnvKeys = ['MONGODB_URI', 'JWT_SECRET'];

for (const envKey of requiredEnvKeys) {
  if (!process.env[envKey]) {
    throw new Error(`Missing required environment variable: ${envKey}`);
  }
}

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongodbUri: process.env.MONGODB_URI,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
});
