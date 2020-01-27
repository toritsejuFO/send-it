import express from 'express';
import { serve, setup } from 'swagger-ui-express';
import Yaml from 'yamljs';

import usersRouter from './users/usersRouter';

const app = express();
const port = 3000;

// Setup docs
app.use('/api/docs/v1', serve, setup(Yaml.load('./docs/swagger/api.v1.yml')));


// Setup routes
app.use('/api/v1/users', usersRouter);

// Base route
app.use('/api/v1', (_, res) => {
  res.status(200).send({
    message: 'Welcome to SendIT API',
  });
});

app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Server running on ${port}`);
});

export default app;
