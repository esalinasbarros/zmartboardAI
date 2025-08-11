import { UsersService } from './users.service';
import { AuthenticatedRequest } from '../types/authenticated-request.type';
export declare class UsersController {
    private readonly usersService;
    private readonly logger;
    constructor(usersService: UsersService);
    searchUserByEmailOrUsername(search: string, req: AuthenticatedRequest): Promise<{
        message: string;
        user: null;
    } | {
        user: {
            id: string;
            email: string;
            username: string;
            firstName: string | null;
            lastName: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            isActive: boolean;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        message?: undefined;
    }>;
}
