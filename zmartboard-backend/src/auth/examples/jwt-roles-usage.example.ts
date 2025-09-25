import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtRolesGuard } from '../guards/jwt-roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '@prisma/client';

/**
 * Example controller demonstrating JWT-based authentication with role-based access control
 * 
 * Usage patterns:
 * 1. JWT Authentication only: @UseGuards(JwtAuthGuard)
 * 2. JWT + Role-based: @UseGuards(JwtRolesGuard) + @Roles(...roles)
 */

@Controller('example')
export class ExampleController {

  // Public endpoint - no authentication required
  @Get('public')
  getPublicData() {
    return { message: 'This is a public endpoint' };
  }

  // JWT authentication required
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtectedData() {
    return { message: 'This endpoint requires JWT authentication' };
  }

  // USER role and above (USER, MODERATOR, ADMIN, SUPER_ADMIN)
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.USER)
  @Get('user-content')
  getUserContent() {
    return { message: 'Content for authenticated users' };
  }

  // MODERATOR role and above (MODERATOR, ADMIN, SUPER_ADMIN)
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post('moderate-content')
  moderateContent() {
    return { message: 'Content moderation action' };
  }

  // ADMIN role and above (ADMIN, SUPER_ADMIN)
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('admin-panel')
  getAdminPanel() {
    return { message: 'Admin panel access' };
  }

  // SUPER_ADMIN only
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post('system-config')
  updateSystemConfig() {
    return { message: 'System configuration updated' };
  }
}

/**
 * Role Hierarchy (from lowest to highest):
 * 1. USER - Basic authenticated user
 * 2. MODERATOR - Can moderate content
 * 3. ADMIN - Can access admin features
 * 4. SUPER_ADMIN - Full system access
 * 
 * Authentication Flow:
 * 1. User registers/logs in → receives JWT token
 * 2. Client includes token in Authorization header: "Bearer <token>"
 * 3. Guards validate token and check user roles
 * 4. Access granted/denied based on role requirements
 * 
 * Frontend Usage:
 * ```javascript
 * // Login
 * const response = await fetch('/auth/login', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ emailOrUsername: 'user@example.com', password: 'password' })
 * });
 * const { access_token } = await response.json();
 * 
 * // Use token for protected requests
 * const protectedResponse = await fetch('/example/protected', {
 *   headers: { 'Authorization': `Bearer ${access_token}` }
 * });
 * ```
 */