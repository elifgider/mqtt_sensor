import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    console.log('Gelen Email:', email); 
    console.log('Gelen şifre:', password); 

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı');
    }
    console.log('Bulunan Kullanıcı:', user); 
  
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Şifre yanlış');
    }

    return user;
  }

  async login(user: any): Promise<{ access_token: string }> {
    const payload = { sub: user.id, role: user.role };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }
}