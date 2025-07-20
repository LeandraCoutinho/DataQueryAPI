import { Router } from 'express';

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

import { PrismaUsersRepository } from '../repositories/prisma/PrismaUsersRepository';
import { FindUserUseCase } from '../useCases/users/FindUserUseCase';

const usersRoutes = Router();

usersRoutes.get(
    '/me', 
    ensureAuthenticated, 
    async (req, res) => {
    const { id } = req.user;

    const usersRepository = new PrismaUsersRepository();
    const findUserUseCase = new FindUserUseCase(usersRepository);

    const user = await findUserUseCase.execute(id);

    return res.status(200).json(user);
});

export { usersRoutes };