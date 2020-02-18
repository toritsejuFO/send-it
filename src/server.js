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
import logger from '../logger';
import asyncErrors from './middleware/asyncErrors';
import AuthRouter from './auth/authRouter';
import ParcelsRouter from './parcels/parcelsRouter';


const app = express();
const { SERVER_PORT } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger.requestLogger);

app.use('/api/docs/v1', serve, setup(Yaml.load('./docs/swagger/api.v1.yml')));
app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/parcels', ParcelsRouter);

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
