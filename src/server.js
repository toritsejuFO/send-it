/* eslint-disable import/first */

// Setup environment variables
import { config } from 'dotenv';

config();


// Third party imports
import 'express-async-errors';
import express from 'express';
import { serve, setup } from 'swagger-ui-express';
import Yaml from 'yamljs';


// API imports
import usersRouter from './users/usersRouter';
import asyncErrors from './middleware/asyncErrors';


const app = express();
const { SERVER_PORT } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.use('/api/docs/v1', serve, setup(Yaml.load('./docs/swagger/api.v1.yml')));
app.use('/api/v1/users', usersRouter);

app.use('/api/v1', (_, res) => {
  res.status(200).send({
    message: 'Welcome to SendIT API',
  });
});

app.use(asyncErrors);


// Avoid port clash when running tests
if (!module.parent) {
  app.listen(SERVER_PORT, () => {
    /* eslint-disable no-console */
    console.log(`Server running on ${SERVER_PORT}`);
  });
}

export default app;
