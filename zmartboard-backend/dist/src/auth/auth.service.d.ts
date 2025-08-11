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
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(emailOrUsername: string, password: string): Promise<Omit<User, 'password'> | null>;
    login(user: Omit<User, 'password'>): Promise<{
        access_token: string;
        user: Omit<User, 'password'>;
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        access_token: string;
        user: Omit<User, 'password'>;
    }>;
    validateUserById(id: string): Promise<Omit<User, 'password'> | null>;
    refreshToken(user: Omit<User, 'password'>): Promise<{
        access_token: string;
    }>;
}
