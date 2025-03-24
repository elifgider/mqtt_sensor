import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string }
  ): Promise<string> {
    console.log('Gelen login isteği:', body); 

    try {
      const user = await this.authService.validateUser(body.email, body.password);

      if (!user) {
        console.log('Kullanıcı doğrulama başarısız');
        throw new UnauthorizedException('E-posta veya şifre hatalı');
      }

      console.log('Kullanıcı doğrulandı:', user.email);

      const { access_token } = await this.authService.login(user); 
      console.log('Erişim token\'ı oluşturuldu:', access_token);

      return access_token; 
    } catch (error) {
      console.error('Login hatası2:', error.message); 
      throw new UnauthorizedException('E-posta veya şifre hatalı');
    }
  }
}