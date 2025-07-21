import { CreateUserData, IUsersRepository } from '../IUsersRepository';

interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

export class InMemoryUsersRepository implements IUsersRepository {
  public items: User[] = [];

  async create(data: CreateUserData): Promise<void> {
    const user: User = {
      id: `user-${this.items.length + 1}`,
      name: data.name,
      email: data.email,
      passwordHash: data.password,
    };

    this.items.push(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id === id);
    return user ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email);
    return user ?? null;
  }
}