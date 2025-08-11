"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UsersController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const guards_1 = require("../auth/guards");
let UsersController = UsersController_1 = class UsersController {
    usersService;
    logger = new common_1.Logger(UsersController_1.name);
    constructor(usersService) {
        this.usersService = usersService;
    }
    async searchUserByEmailOrUsername(search, req) {
        const user = await this.usersService.findLikeByEmailOrUsername(search);
        if (!user) {
            return { message: 'User not found', user: null };
        }
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Search user by email or username (partial match)',
        description: 'Find a user by partial email address or username match. Case-insensitive search that returns users containing the search term. Used for user lookup with debouncing on the frontend.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        description: 'Partial email or username to search for (case-insensitive)',
        required: true,
        type: String,
        example: 'john or john@exam or john_',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User found successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                username: { type: 'string' },
                firstName: { type: 'string', nullable: true },
                lastName: { type: 'string', nullable: true },
                role: { type: 'string', enum: ['USER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'] },
                isActive: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'User not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "searchUserByEmailOrUsername", null);
exports.UsersController = UsersController = UsersController_1 = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiCookieAuth)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map