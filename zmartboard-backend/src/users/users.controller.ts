import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards';
import { AuthenticatedRequest } from '../types/authenticated-request.type';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiCookieAuth()
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Search user by email or username (partial match)',
    description: 'Find a user by partial email address or username match. Case-insensitive search that returns users containing the search term. Used for user lookup with debouncing on the frontend.',
  })
  @ApiQuery({
    name: 'search',
    description: 'Partial email or username to search for (case-insensitive)',
    required: true,
    type: String,
    example: 'john or john@exam or john_',
  })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Get('search')
  async searchUserByEmailOrUsername(
    @Query('search') search: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const user = await this.usersService.findLikeByEmailOrUsername(search);

    if (!user) {
      return { message: 'User not found', user: null };
    }

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  }
}