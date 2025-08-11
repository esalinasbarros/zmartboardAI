import { PrismaService } from '../prisma/prisma.service';
import { User, UserRole } from '@prisma/client';
export interface CreateUserDto {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: UserRole;
}
export interface UpdateUserDto {
    email?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    role?: UserRole;
    isActive?: boolean;
}
export declare class UsersService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>>;
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findById(id: string): Promise<Omit<User, 'password'> | null>;
    findByEmailOrUsername(emailOrUsername: string): Promise<User | null>;
    findLikeByEmailOrUsername(emailOrUsername: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>>;
    validatePassword(user: User, password: string): Promise<boolean>;
    changePassword(id: string, newPassword: string): Promise<void>;
}
