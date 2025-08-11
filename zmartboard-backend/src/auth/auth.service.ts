import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService, CreateUserDto } from '../users/users.service';
import { User } from '@prisma/client';

export interface LoginDto {
  emailOrUsername: string;
  password: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(emailOrUsername: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmailOrUsername(emailOrUsername);
    
    if (!user) {
      return null;
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = await this.usersService.validatePassword(user, password);
    
    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(user: Omit<User, 'password'>): Promise<{ access_token: string; user: Omit<User, 'password'> }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(createUserDto: CreateUserDto): Promise<{ access_token: string; user: Omit<User, 'password'> }> {
    // Validate input
    if (!createUserDto.email || !createUserDto.username || !createUserDto.password) {
      throw new BadRequestException('Email, username, and password are required');
    }

    if (createUserDto.password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(createUserDto.email)) {
      throw new BadRequestException('Invalid email format');
    }

    // Username validation
    if (createUserDto.username.length < 3) {
      throw new BadRequestException('Username must be at least 3 characters long');
    }

    const user = await this.usersService.create(createUserDto);
    return this.login(user);
  }

  async validateUserById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findById(id);
    
    if (!user || !user.isActive) {
      return null;
    }

    return user;
  }

  async refreshToken(user: Omit<User, 'password'>): Promise<{ access_token: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}