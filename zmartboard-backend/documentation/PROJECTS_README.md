# Project Management API

This document describes the project management functionality in the Zmart Board backend application.

## Overview

The project management system allows users to create and manage projects with role-based access control. Each project can have multiple users, and each user has a specific role within the project.

## Database Schema

### Project Model
- `id`: Unique identifier (String)
- `title`: Project title (String, max 100 characters)
- `description`: Project description (String, max 500 characters, optional)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- `members`: Array of project members

### ProjectMember Model
- `id`: Unique identifier (String)
- `userId`: Reference to User
- `projectId`: Reference to Project
- `role`: Project role (DEVELOPER or ADMIN)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Project Roles
- `DEVELOPER`: Can view project and participate in development
- `ADMIN`: Can manage project settings, add/remove members, and assign roles

## API Endpoints

### Authentication
All project endpoints require authentication via JWT token (Bearer token or HTTP-only cookie).

### Project Management

#### Create Project
```
POST /api/projects
```
**Authorization**: Admin, Moderator, or Super Admin only

**Request Body**:
```json
{
  "title": "My Awesome Project",
  "description": "This is a description of my awesome project"
}
```

**Response**: Project object with creator as admin member

#### Get User Projects
```
GET /api/projects
```
**Authorization**: Authenticated user

**Response**: Array of projects where the user is a member

#### Get All Projects (System Admin)
```
GET /api/projects/admin/all
```
**Authorization**: Admin or Super Admin only

**Response**: Array of all projects in the system

#### Get Project by ID
```
GET /api/projects/:id
```
**Authorization**: Project member

**Response**: Project details with members

#### Update Project
```
PUT /api/projects/:id
```
**Authorization**: Project admin only

**Request Body**:
```json
{
  "title": "Updated Project Title",
  "description": "Updated project description"
}
```

#### Delete Project
```
DELETE /api/projects/:id
```
**Authorization**: Project admin only

**Response**: Success message

### Member Management

#### Add Project Member
```
POST /api/projects/:id/members
```
**Authorization**: Project admin only

**Request Body**:
```json
{
  "userId": "clx1234567890",
  "role": "DEVELOPER"
}
```

**Response**: Project member object

#### Update Member Role
```
PUT /api/projects/:id/members/:memberId/role
```
**Authorization**: Project admin only

**Request Body**:
```json
{
  "role": "ADMIN"
}
```

#### Remove Project Member
```
DELETE /api/projects/:id/members/:memberId
```
**Authorization**: Project admin only

**Response**: Success message

**Note**: Cannot remove the last admin from a project

## Permission System

### System-Level Permissions
- **Create Projects**: Admin, Moderator, Super Admin
- **View All Projects**: Admin, Super Admin

### Project-Level Permissions
- **View Project**: Any project member
- **Update Project**: Project admin
- **Delete Project**: Project admin
- **Add Members**: Project admin
- **Remove Members**: Project admin
- **Update Member Roles**: Project admin

## Business Rules

1. **Project Creation**: Only system admins and moderators can create projects
2. **Creator Role**: The user who creates a project automatically becomes a project admin
3. **Admin Protection**: Cannot remove the last admin from a project
4. **Member Uniqueness**: A user can only be a member of a project once
5. **Role Assignment**: Only project admins can assign admin roles to other users

## Error Handling

### Common Error Responses

- `400 Bad Request`: Invalid request data or business rule violation
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Project, user, or member not found
- `409 Conflict`: User is already a project member

### Example Error Response
```json
{
  "statusCode": 403,
  "message": "Only project admins can add members",
  "error": "Forbidden"
}
```

## Usage Examples

### Creating a Project
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Project",
    "description": "A project for managing tasks"
  }'
```

### Adding a Member
```bash
curl -X POST http://localhost:3000/api/projects/PROJECT_ID/members \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "role": "DEVELOPER"
  }'
```

## Swagger Documentation

All project endpoints are documented in Swagger UI at `/api/docs` with:
- Interactive API explorer
- Request/response schemas
- Authentication examples
- Error response documentation

## Development Notes

### Adding New Project Features
1. Update the Prisma schema if database changes are needed
2. Run `npx prisma migrate dev` to apply schema changes
3. Update the ProjectsService with new business logic
4. Add new endpoints to ProjectsController
5. Create/update DTOs with validation and Swagger decorators
6. Update this documentation

### Testing
- Use Swagger UI for interactive testing
- Ensure proper authentication tokens
- Test permission boundaries
- Verify error handling

## Security Considerations

1. **Authentication**: All endpoints require valid JWT tokens
2. **Authorization**: Role-based access control at system and project levels
3. **Input Validation**: All request data is validated using class-validator
4. **Data Sanitization**: Automatic whitelist validation prevents unwanted fields
5. **Permission Checks**: Multiple layers of permission verification

## Future Enhancements

- Project templates
- Project categories/tags
- Project archiving
- Member invitation system
- Activity logging
- Project statistics
- Bulk member operations