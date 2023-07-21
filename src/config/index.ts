import 'dotenv/config';
import { ConfigType } from './types';

const acceptedEnvironments = ['development', 'staging', 'production'];

const environmentExtensions = {
  development: '_DEV',
  staging: '_STAGING',
  production: '_PROD',
};

let environment = process.env.NODE_ENV;
if (!acceptedEnvironments.includes(environment)) {
  environment = acceptedEnvironments[0];
}

const config: ConfigType = {
  auth: {
    userKey: process.env[`JWT_KEY${environmentExtensions[environment]}`],
  },
  database: {
    db: process.env[`DB${environmentExtensions[environment]}`],
    host: process.env[`DB_HOST${environmentExtensions[environment]}`],
    password: process.env[`DB_PASSWORD${environmentExtensions[environment]}`],
    username: process.env[`DB_USERNAME${environmentExtensions[environment]}`],
  },
}

export default config;
