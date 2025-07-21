import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger.docs';

import { routes } from './routes';
import { handleAppError } from './middlewares/handleAppError';

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(handleAppError);

app.listen(3333, () => {
  console.log('HTTP server running!');
  console.log(`Swagger em http://localhost:3333/api-docs`);
});