import { Response as ExpressResponse } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthenticatedRequest } from '../types/authenticated-request.type';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto, res: ExpressResponse): Promise<ExpressResponse<any, Record<string, any>>>;
    login(loginDto: LoginDto, res: ExpressResponse): Promise<ExpressResponse<any, Record<string, any>>>;
    getProfile(req: any): {
        user: AuthenticatedRequest;
    };
    refreshToken(req: any, res: ExpressResponse): Promise<ExpressResponse<any, Record<string, any>>>;
    logout(res: ExpressResponse): Promise<ExpressResponse<any, Record<string, any>>>;
    getAdminUsers(): {
        message: string;
        users: never[];
    };
    getModeratorDashboard(): {
        message: string;
        data: {};
    };
    getSuperAdminSystem(): {
        message: string;
        systemInfo: {};
    };
}
