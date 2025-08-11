# JWT Authentication with Role-Based Access Control

This authentication system provides JWT-based authentication with comprehensive role-based access control for both web and mobile applications.

## Features

- **JWT-Only Authentication** - Stateless authentication using JSON Web Tokens
- **Role-Based Access Control (RBAC)** - Four-tier role system with hierarchical permissions
- **Mobile & Web Support** - Designed for cross-platform compatibility
- **Secure Password Hashing** - bcrypt with 12 salt rounds
- **Input Validation** - Comprehensive validation using class-validator
- **TypeScript Support** - Full type safety with Prisma-generated types

## User Roles

The system implements a hierarchical role structure:

1. **USER** - Basic authenticated user (default)
2. **MODERATOR** - Content moderation capabilities
3. **ADMIN** - Administrative access
4. **SUPER_ADMIN** - Full system access

## API Endpoints

### Authentication

#### Register User
```json
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER" // Optional: USER, MODERATOR, ADMIN, SUPER_ADMIN
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```json
POST /api/auth/login
Content-Type: application/json

{
  "emailOrUsername": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Profile
```json
GET /api/auth/profile
Authorization: Bearer <access_token>
```

#### Refresh Token
```http
POST /api/auth/refresh-token
Authorization: Bearer <access_token>
```

### Role-Based Endpoints (Examples)

#### Admin Users (ADMIN, SUPER_ADMIN)
```http
GET /api/auth/admin/users
Authorization: Bearer <access_token>
```

#### Moderator Dashboard (MODERATOR, ADMIN, SUPER_ADMIN)
```http
GET /api/auth/moderator/dashboard
Authorization: Bearer <access_token>
```

#### Super Admin System (SUPER_ADMIN only)
```http
GET /api/auth/super-admin/system
Authorization: Bearer <access_token>
```

## Implementation Guide

### Using Guards in Controllers

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { JwtRolesGuard } from './auth/guards/jwt-roles.guard';
import { Roles } from './auth/decorators/roles.decorator';
import { UserRole } from '../generated/prisma';

@Controller('example')
export class ExampleController {
  // JWT authentication only
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtectedData() {
    return { message: 'JWT authenticated endpoint' };
  }

  // Role-based access control
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('admin-only')
  getAdminData() {
    return { message: 'Admin only endpoint' };
  }
}
```

### Available Guards

1. **JwtAuthGuard** - JWT authentication only
2. **JwtRolesGuard** - JWT authentication + role-based authorization
3. **RolesGuard** - Role-based authorization (use with JwtAuthGuard)

### Role Assignment

Roles can be assigned during registration or updated later:

```typescript
// During registration
const registerDto = {
  email: 'admin@example.com',
  username: 'admin',
  password: 'password123',
  role: UserRole.ADMIN // Optional, defaults to USER
};

// Update user role (implement in your user management)
const updateUserDto = {
  role: UserRole.MODERATOR
};
```

## Mobile & Web Integration

### Web Applications (Cookie-based)

```javascript
// Login - JWT token automatically stored in HTTP-only cookie
const login = async (emailOrUsername, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important: include cookies
    body: JSON.stringify({ emailOrUsername, password })
  });
  
  const data = await response.json();
  return data; // No need to manually store token
};

// Make authenticated requests - cookies sent automatically
const makeAuthenticatedRequest = async (url) => {
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include', // Important: include cookies
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

// Logout - clear cookie
const logout = async () => {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};
```

### Mobile Applications (Token-based fallback)

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// For mobile apps, you can still use Authorization header as fallback
// The JWT strategy supports both cookies and Authorization header

// Login and extract token from response headers or use a separate endpoint
const login = async (emailOrUsername, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailOrUsername, password })
  });
  
  const data = await response.json();
  // For mobile, you might need a separate endpoint that returns the token
  // or extract it from Set-Cookie header (more complex)
  return data;
};

// Make authenticated requests with Authorization header
const makeAuthenticatedRequest = async (url) => {
  const token = await AsyncStorage.getItem('access_token');
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};
```

## Database Schema

### User Model
```prisma
enum UserRole {
  USER
  MODERATOR
  ADMIN
  SUPER_ADMIN
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  password  String
  firstName String?
  lastName  String?
  role      UserRole @default(USER)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# JWT Secret (use a strong, random secret in production)
JWT_SECRET="your-super-secret-jwt-key-here"

# Application
PORT=3000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL="http://localhost:3001"
```

## Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Expiration**: 7 days (configurable)
- **HTTP-Only Cookies**: JWT tokens stored in secure, HTTP-only cookies
- **Cookie Security**: Secure flag in production, SameSite protection
- **Input Validation**: Comprehensive validation using class-validator
- **CORS Configuration**: Configurable for different environments with credentials support
- **Role-Based Authorization**: Hierarchical permission system
- **Account Status**: User activation/deactivation support
- **XSS Protection**: HTTP-only cookies prevent client-side script access
- **CSRF Protection**: SameSite cookie attribute provides CSRF protection

## Running the Application

### Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

4. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

5. **Start development server:**
   ```bash
   npm run start:dev
   ```

### Docker Container Setup

If running in Docker, execute migrations inside the container:

```bash
# Find your container name
docker ps

# Run migrations
docker exec -it <container-name> npx prisma migrate dev

# Generate Prisma client
docker exec -it <container-name> npx prisma generate

# Reset database (if needed)
docker exec -it <container-name> npx prisma migrate reset
```

### Production

1. **Set production environment variables**
2. **Use a strong JWT secret**
3. **Configure proper CORS settings**
4. **Set up SSL/TLS**
5. **Use a production database**
6. **Implement proper logging and monitoring**

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## API Testing with curl

### Cookie-based Authentication (Recommended)

```bash
# Register (saves cookie automatically)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'

# Login (saves cookie automatically)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"emailOrUsername":"test@example.com","password":"password123"}'

# Access protected endpoint (uses saved cookie)
curl -X GET http://localhost:3000/api/auth/profile \
  -b cookies.txt

# Logout (clears cookie)
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt \
  -c cookies.txt
```

### Token-based Authentication (Fallback for mobile)

```bash
# For mobile apps or when cookies aren't suitable
# The JWT strategy still supports Authorization header as fallback
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```