import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  NODE_ENV: Joi.string().default('dev'),
  PG_DB: Joi.required(),
  PG_USER: Joi.string().required(),
  PG_PASSWORD: Joi.string().min(7).required(),
  PG_PORT: Joi.number().default(5432),
  PG_HOST: Joi.string().required(),
  PORT: Joi.required().default(3001),
  HOST_API: Joi.string().required(),
  DOCKER_CONTAINER_NAME: Joi.string().required(),
  JWT_SECRET_KEY: Joi.string().required(),
});
