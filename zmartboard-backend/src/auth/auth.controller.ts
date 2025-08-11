import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Response,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  RegisterOperation,
  RegisterBody,
  RegisterSuccessResponse,
  RegisterBadRequestResponse,
  RegisterConflictResponse,
  LoginOperation,
  LoginBody,
  LoginSuccessResponse,
  LoginUnauthorizedResponse,
  ProfileOperation,
  ProfileBearerAuth,
  ProfileCookieAuth,
  ProfileSuccessResponse,
  ProfileUnauthorizedResponse,
  RefreshTokenOperation,
  RefreshTokenBearerAuth,
  RefreshTokenCookieAuth,
  RefreshTokenSuccessResponse,
  RefreshTokenUnauthorizedResponse,
  LogoutOperation,
  LogoutSuccessResponse,
  AdminUsersOperation,
  AdminUsersBearerAuth,
  AdminUsersCookieAuth,
  AdminUsersSuccessResponse,
  AdminUsersUnauthorizedResponse,
  AdminUsersForbiddenResponse,
  ModeratorDashboardOperation,
  ModeratorDashboardBearerAuth,
  ModeratorDashboardCookieAuth,
  ModeratorDashboardSuccessResponse,
  ModeratorDashboardUnauthorizedResponse,
  ModeratorDashboardForbiddenResponse,
  SuperAdminSystemOperation,
  SuperAdminSystemBearerAuth,
  SuperAdminSystemCookieAuth,
  SuperAdminSystemSuccessResponse,
  SuperAdminSystemUnauthorizedResponse,
  SuperAdminSystemForbiddenResponse,
} from './auth.swagger';
import { Response as ExpressResponse } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRolesGuard } from './guards/jwt-roles.guard';
import { Roles } from './decorators/roles.decorator';
import { User, UserRole } from '@prisma/client';
import { AuthenticatedRequest } from '../types/authenticated-request.type';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @RegisterOperation
  @RegisterBody
  @RegisterSuccessResponse
  @RegisterBadRequestResponse
  @RegisterConflictResponse
  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Response() res: ExpressResponse) {
    const result = await this.authService.register(registerDto);
    
    // Set JWT token in HTTP-only cookie
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    return res.json({
      message: 'Registration successful',
      user: result.user,
    });
  }

  @LoginOperation
  @LoginBody
  @LoginSuccessResponse
  @LoginUnauthorizedResponse
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Response() res: ExpressResponse) {
    const user = await this.authService.validateUser(loginDto.emailOrUsername, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const result = await this.authService.login(user);
    
    // Set JWT token in HTTP-only cookie
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    return res.json({
      message: 'Login successful',
      user: result.user,
    });
  }

  @ProfileOperation
  @ProfileBearerAuth
  @ProfileCookieAuth
  @ProfileSuccessResponse
  @ProfileUnauthorizedResponse
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req): { user: AuthenticatedRequest } {
    return {
      user: req.user,
    };
  }

  @RefreshTokenOperation
  @RefreshTokenBearerAuth
  @RefreshTokenCookieAuth
  @RefreshTokenSuccessResponse
  @RefreshTokenUnauthorizedResponse
  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  async refreshToken(@Request() req, @Response() res: ExpressResponse) {
    const result = await this.authService.refreshToken(req.user);
    
    // Set new JWT token in HTTP-only cookie
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    return res.json({
      message: 'Token refreshed successfully',
    });
  }

  @LogoutOperation
  @LogoutSuccessResponse
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Response() res: ExpressResponse) {
    // Clear the JWT cookie
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    
    return res.json({
      message: 'Logout successful',
    });
  }

  // Role-based endpoints for demonstration
  @AdminUsersOperation
  @AdminUsersBearerAuth
  @AdminUsersCookieAuth
  @AdminUsersSuccessResponse
  @AdminUsersUnauthorizedResponse
  @AdminUsersForbiddenResponse
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('admin/users')
  getAdminUsers() {
    return {
      message: 'Admin users endpoint - accessible by ADMIN and SUPER_ADMIN',
      users: [],
    };
  }

  @ModeratorDashboardOperation
  @ModeratorDashboardBearerAuth
  @ModeratorDashboardCookieAuth
  @ModeratorDashboardSuccessResponse
  @ModeratorDashboardUnauthorizedResponse
  @ModeratorDashboardForbiddenResponse
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('moderator/dashboard')
  getModeratorDashboard() {
    return {
      message: 'Moderator dashboard - accessible by MODERATOR, ADMIN, and SUPER_ADMIN',
      data: {},
    };
  }

  @SuperAdminSystemOperation
  @SuperAdminSystemBearerAuth
  @SuperAdminSystemCookieAuth
  @SuperAdminSystemSuccessResponse
  @SuperAdminSystemUnauthorizedResponse
  @SuperAdminSystemForbiddenResponse
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('super-admin/system')
  getSuperAdminSystem() {
    return {
      message: 'Super admin system - accessible by SUPER_ADMIN only',
      systemInfo: {},
    };
  }
}