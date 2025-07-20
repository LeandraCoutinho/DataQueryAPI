import { Router } from 'express';

import { PrismaUsersRepository } from '../repositories/prisma/PrismaUsersRepository';
import { CreateUserUseCase } from '../useCases/users/CreateUserUseCase';
import { AuthenticateUserUseCase } from '../useCases/authenticate/AuthenticateUserUseCase';

const authenticateRoutes = Router();

authenticateRoutes.post(
    '/register',
    async (req, res) => {
        const { name, email, password } = req.body;

        const usersRepository = new PrismaUsersRepository();
        const createUserUseCase = new CreateUserUseCase(
            usersRepository
        );

        await createUserUseCase.execute({
            name,
            email,
            password
        });

        return res.status(201).send();
    }
)

authenticateRoutes.post(
  '/login', 
  async (req, res) => {
  const { email, password } = req.body;

  const usersRepository = new PrismaUsersRepository();
  const authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);

  const authenticateData = await authenticateUserUseCase.execute({
    email,
    password,
  });

  return res.status(200).json(authenticateData);
});

export { authenticateRoutes };