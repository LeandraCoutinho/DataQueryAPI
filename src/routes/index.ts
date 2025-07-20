import { Router } from 'express';

import { usersRoutes } from './users.routes';
import { authenticateRoutes } from './authenticate.routes';
import { datasetsRoutes } from './datasets.routes';
import { recordsRoutes } from './records.routes';

const routes = Router();

routes.use(usersRoutes);
routes.use('/auth', authenticateRoutes);
routes.use('/datasets', datasetsRoutes);
routes.use('/records', recordsRoutes);

export { routes };