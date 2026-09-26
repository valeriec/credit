import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from './types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async createUser(username: string, password: string, role: UserRole = UserRole.ANALYST): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      username,
      passwordHash,
      role,
    });
    return this.usersRepository.save(user);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  async ensureDefaultUsers(): Promise<void> {
    const advisor = await this.findByUsername('asesor');
    if (!advisor) {
      await this.createUser('asesor', 'Asesor123!', UserRole.CREDIT_ADVISOR);
    }

    const analyst = await this.findByUsername('analista');
    if (!analyst) {
      await this.createUser('analista', 'Analista123!', UserRole.ANALYST);
    }

    const agent = await this.findByUsername('agente');
    if (!agent) {
      await this.createUser('agente', 'Agente123!', UserRole.OPERATIONS_AGENT);
    }
  }
}
