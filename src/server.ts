import express from 'express';
import cors from 'cors';

import { routes } from './routes';
import { handleAppError } from './middlewares/handleAppError';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(handleAppError);

app.listen(3333, () => console.log('HTTP server running!'));