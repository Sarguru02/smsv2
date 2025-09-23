export const Env = {
  jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
  nodeEnv: process.env.NODE_ENV,
  seedUser: process.env.SEED_USER,
  seedPassword: process.env.SEED_PASSWORD,
} as const;
