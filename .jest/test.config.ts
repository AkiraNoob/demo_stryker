import dotenv from 'dotenv';

dotenv.config();

const jestConfigEnv = {
  PORT: process.env.PORT,
  MONGODB_CONNECT_STRING: process.env.MONGODB_CONNECT_STRING,
  MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
};
export { jestConfigEnv };
