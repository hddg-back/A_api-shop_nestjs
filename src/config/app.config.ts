export const ConfigEnv = () => ({
  env: process.env.NODE_ENV || 'dev',
  pgDb: process.env.PG_DB,
  pgUser: process.env.PG_USER,
  pgPassword: process.env.PG_PASSWORD,
  pgPort: process.env.PG_PORT,
  pgHost: process.env.PG_HOST,
  port: process.env.PORT,
  hostApi: process.env.HOST_API,
  defaultLimitPagination: process.env.DEFAUL_LIMIT_PAGINATION || 8,
  jwtSecret: process.env.JWT_SECRET_KEY,
});
