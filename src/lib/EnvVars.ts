export const Env = {
  jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
  nodeEnv: process.env.NODE_ENV,
  seedUser: process.env.SEED_USER,
  seedPassword: process.env.SEED_PASSWORD,
  blobReadWriteToken: process.env.BLOB_READ_WRITE_TOKEN,
  qstashCurrentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
  qstashNextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
  qstashToken: process.env.QSTASH_TOKEN,
  qstashUrl: process.env.QSTASH_URL,
  apiHost: process.env.NEXT_PUBLIC_API_HOST,
} as const;
