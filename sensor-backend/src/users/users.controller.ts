import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    UseGuards,
    Req,
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { User } from './user.entity';
  import { Request } from 'express';
  import { AuthGuard } from '@nestjs/passport';
  import { RolesGuard } from '../auth/roles.guard';
  import { UserRole } from './user.entity';
  import { Roles } from '../auth/roles.decarator'; 
  
  @Controller('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SYSTEM_ADMIN)
    @Post()
    create(@Body() userData: Partial<User>) {
      return this.usersService.create(userData);
    }
  
    // Sadece giriş yapan herkes erişebilir, sonuç rolüne göre filtrelenir
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Get()
    findAll(@Req() req: Request) {
      const user = req.user as any;
      return this.usersService.findAll(user.role, user.id);
    }
  
    // Kendi profilini herkes görebilir
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Get(':id')
    findOne(@Param('id') id: number) {
      return this.usersService.findOne(+id);
    }
  
    // Güncelleme: SA & CA izinli
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SYSTEM_ADMIN, UserRole.COMPANY_ADMIN)
    @Patch(':id')
    update(@Param('id') id: number, @Body() userData: Partial<User>) {
      return this.usersService.update(+id, userData);
    }
  
    // Silme: Sadece System Admin
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SYSTEM_ADMIN)
    @Delete(':id')
    remove(@Param('id') id: number) {
      return this.usersService.remove(+id);
    }
  }