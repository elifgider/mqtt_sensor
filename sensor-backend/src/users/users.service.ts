import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const email = this.configService.get<string>('INIT_ADMIN_EMAIL');
    const rawPassword = this.configService.get<string>('INIT_ADMIN_PASSWORD');
    const name = this.configService.get<string>('INIT_ADMIN_NAME') || 'System Admin';
    if (!email || !rawPassword) {
      console.warn('⚠️ .env dosyasında INIT_ADMIN_EMAIL veya INIT_ADMIN_PASSWORD tanımlı değil.');
      return;
    }

    const existing = await this.userRepository.findOneBy({ email });

    if (!existing) {
      const passwordHash = await bcrypt.hash(rawPassword, 10);
      const user = this.userRepository.create({
        name,
        email,
        password: passwordHash,
        role: UserRole.SYSTEM_ADMIN,
      });

      await this.userRepository.save(user);
      console.log(`İlk System Admin oluşturuldu: ${email} / ${rawPassword}`);
    } else {
      console.log('Admin zaten var, yeni kullanıcı eklenmedi.');
    }
  }

  async findAll(requesterRole: UserRole, requesterId: number): Promise<User[]> {
    if (requesterRole === UserRole.SYSTEM_ADMIN) {
      return this.userRepository.find({
        where: { role: Not(UserRole.SYSTEM_ADMIN) },
      });
    }

    if (requesterRole === UserRole.COMPANY_ADMIN) {
      return this.userRepository.find({
        where: { role: UserRole.USER },
      });
    }

    return this.userRepository.find({
      where: { id: requesterId },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    console.log('Bulunan Kullanıcı:', user);  
    return user;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Kullanıcı bulunamadı (id: ${id})`);
    }
    return user;
  }

  async create(userData: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(userData);

    if (newUser.password) {
      const salt = await bcrypt.genSalt();
      newUser.password = await bcrypt.hash(newUser.password, salt);
    }

    return this.userRepository.save(newUser);
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    await this.findOne(id);
    await this.userRepository.update(id, userData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.userRepository.delete(id);
  }
}
