/* eslint-disable import/first */

// Setup environment variables
import { config } from 'dotenv';

config();


// Third party imports
import express from 'express';
import { serve, setup } from 'swagger-ui-express';
import Yaml from 'yamljs';


// API imports
import usersRouter from './users/usersRouter';


const app = express();
const { SERVER_PORT } = process.env;

// Setup docs route
app.use('/api/docs/v1', serve, setup(Yaml.load('./docs/swagger/api.v1.yml')));

// Setup API routes
app.use('/api/v1/users', usersRouter);

// Setup Base route
app.use('/api/v1', (_, res) => {
  res.status(200).send({
    message: 'Welcome to SendIT API',
  });
});

if (!module.parent) {
  app.listen(SERVER_PORT, () => {
    /* eslint-disable no-console */
    console.log(`Server running on ${SERVER_PORT}`);
  });
}

export default app;
