import { Router } from 'express';

import { usersRoutes } from './users.routes';
import { authenticateRoutes } from './authenticate.routes';

const routes = Router();

routes.use(usersRoutes);
routes.use('/auth', authenticateRoutes);

export { routes };