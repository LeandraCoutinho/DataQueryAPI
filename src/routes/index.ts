import { Router } from 'express';

import { usersRoutes } from './users.routes';
import { authenticateRoutes } from './authenticate.routes';
import { datasetsRoutes } from './datasets.routes';
import { recordsRoutes } from './records.routes';
import { queriesRoutes } from './queries.routes';

const routes = Router();

routes.use(usersRoutes);
routes.use('/auth', authenticateRoutes);
routes.use('/datasets', datasetsRoutes);
routes.use('/records', recordsRoutes);
routes.use('/queries', queriesRoutes);

export { routes };