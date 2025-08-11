# API Documentation with Swagger

This project includes comprehensive API documentation using Swagger/OpenAPI 3.0. The documentation provides interactive API exploration and testing capabilities.

## Accessing the Documentation

Once the development server is running, you can access the Swagger UI at:

```
http://localhost:3000/api/docs
```

## Features

### 🔍 Interactive API Explorer
- Browse all available endpoints
- View request/response schemas
- Test API endpoints directly from the browser
- See example requests and responses

### 🔐 Authentication Support
The API documentation includes support for:
- **Bearer Token Authentication**: For JWT tokens
- **Cookie Authentication**: For session-based auth

### 📚 Organized by Tags
Endpoints are organized into logical groups:
- **auth**: Authentication and authorization endpoints
- **email**: Email verification and management endpoints

## API Endpoints Overview

### Authentication Endpoints (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/profile` | Get user profile | Yes |
| POST | `/auth/refresh-token` | Refresh access token | Yes |
| POST | `/auth/logout` | Logout user | No |
| GET | `/auth/admin/users` | Get admin users | Yes (Admin+) |
| GET | `/auth/moderator/dashboard` | Get moderator dashboard | Yes (Moderator+) |
| GET | `/auth/super-admin/system` | Get system info | Yes (Super Admin) |

### Email Verification Endpoints (`/email`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/email/send-verification` | Send verification email | No |
| POST | `/email/verify-code` | Verify email code | No |
| POST | `/email/resend-verification` | Resend verification email | No |
| POST | `/email/send-password-reset` | Send password reset email | No |
| POST | `/email/verify-password-reset` | Verify password reset code | No |
| POST | `/email/send-email-change` | Send email change verification | Yes |
| POST | `/email/verify-email-change` | Verify email change code | Yes |

## Using the Swagger UI

### 1. Testing Endpoints
1. Navigate to the endpoint you want to test
2. Click "Try it out"
3. Fill in the required parameters
4. Click "Execute"
5. View the response

### 2. Authentication
For protected endpoints:

#### Using Bearer Token:
1. Click the "Authorize" button at the top
2. Enter your JWT token in the "Bearer" field
3. Click "Authorize"
4. The token will be included in subsequent requests

#### Using Cookie Authentication:
- If you're logged in through the browser, cookies will be automatically included

### 3. Understanding Responses
Each endpoint shows:
- **Request Schema**: Required and optional parameters
- **Response Schema**: Structure of successful responses
- **Error Responses**: Possible error codes and messages
- **Examples**: Sample requests and responses

## Request/Response Examples

### User Registration
```json
// POST /auth/register
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER"
}
```

### Email Verification
```json
// POST /email/send-verification
{
  "email": "user@example.com",
  "type": "EMAIL_VERIFICATION",
  "userId": "clx1234567890"
}
```

### Code Verification
```json
// POST /email/verify-code
{
  "email": "user@example.com",
  "code": "123456",
  "type": "EMAIL_VERIFICATION"
}
```

## Error Handling

The API uses standard HTTP status codes:

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized
- **403**: Forbidden (insufficient permissions)
- **409**: Conflict (resource already exists)
- **429**: Too Many Requests (rate limiting)
- **500**: Internal Server Error

## Data Models

### User Roles
```typescript
enum UserRole {
  USER = "USER",
  MODERATOR = "MODERATOR",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN"
}
```

### Verification Types
```typescript
enum VerificationType {
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
  PASSWORD_RESET = "PASSWORD_RESET",
  EMAIL_CHANGE = "EMAIL_CHANGE"
}
```

## Development Notes

### Adding New Endpoints
When adding new endpoints, include these Swagger decorators:

```typescript
@ApiOperation({ summary: 'Endpoint description' })
@ApiResponse({ status: 200, description: 'Success response' })
@ApiResponse({ status: 400, description: 'Error response' })
@ApiBody({ type: YourDto }) // For POST/PUT requests
@ApiBearerAuth() // For protected endpoints
```

### DTO Documentation
Ensure all DTOs include Swagger decorators:

```typescript
export class ExampleDto {
  @ApiProperty({
    description: 'Field description',
    example: 'example value',
  })
  @IsString()
  field: string;
}
```

## Security Considerations

- Sensitive data (passwords, tokens) are not exposed in examples
- Rate limiting is documented where applicable
- Authentication requirements are clearly marked
- Role-based access control is documented

## Troubleshooting

### Common Issues

1. **Swagger UI not loading**
   - Ensure the server is running on the correct port
   - Check for any console errors

2. **Authentication not working**
   - Verify the token format
   - Check token expiration
   - Ensure proper authorization headers

3. **Validation errors**
   - Check required fields
   - Verify data types and formats
   - Review validation rules in DTOs

## Additional Resources

- [Swagger/OpenAPI Specification](https://swagger.io/specification/)
- [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
- [API Testing Best Practices](https://swagger.io/resources/articles/best-practices-in-api-testing/)

---

**Note**: This documentation is automatically generated from code annotations and stays in sync with the actual API implementation.