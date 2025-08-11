# Swagger Documentation Separation Guide

This guide explains how to separate Swagger/OpenAPI documentation from controllers into dedicated files for better code organization and maintainability.

## Overview

Instead of cluttering controllers with extensive Swagger decorators, we can extract them into separate files. This approach:

- **Improves readability**: Controllers focus on business logic
- **Enhances maintainability**: Documentation changes don't affect controller code
- **Enables reusability**: Decorators can be shared across multiple endpoints
- **Reduces file size**: Controllers become more concise

## Implementation Example: Projects Controller

### 1. Create Swagger Documentation File

Create `src/projects/projects.swagger.ts`:

```typescript
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { ProjectRole } from '../../generated/prisma';
import { CreateProjectDto, UpdateProjectDto } from './dto';

// Export individual decorators
export const CreateProjectOperation = ApiOperation({ 
  summary: 'Create a new project (Admin/Moderator only)' 
});

export const CreateProjectBody = ApiBody({ type: CreateProjectDto });

export const CreateProjectResponse201 = ApiResponse({
  status: 201,
  description: 'Project created successfully',
  schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      description: { type: 'string' },
      // ... more properties
    },
  },
});

export const CreateProjectResponse403 = ApiResponse({ 
  status: 403, 
  description: 'Forbidden - insufficient permissions' 
});
```

### 2. Update Controller

In `src/projects/projects.controller.ts`:

```typescript
import {
  CreateProjectOperation,
  CreateProjectBody,
  CreateProjectResponse201,
  CreateProjectResponse403,
} from './projects.swagger';

@Controller('projects')
export class ProjectsController {
  @Post()
  @CreateProjectOperation
  @CreateProjectBody
  @CreateProjectResponse201
  @CreateProjectResponse403
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    // Implementation
  }
}
```

## Best Practices

### 1. Naming Convention

- Use descriptive names that indicate the endpoint and decorator type
- Format: `{EndpointName}{DecoratorType}{StatusCode?}`
- Examples:
  - `CreateProjectOperation`
  - `CreateProjectBody`
  - `CreateProjectResponse201`
  - `UpdateProjectParam`

### 2. File Organization

```
src/
├── projects/
│   ├── dto/
│   │   ├── create-project.dto.ts
│   │   └── update-project.dto.ts
│   ├── projects.controller.ts
│   ├── projects.service.ts
│   ├── projects.swagger.ts    # Swagger documentation
│   └── projects.module.ts
```

### 3. Grouping Decorators

Group related decorators by endpoint:

```typescript
// Create Project Decorators
export const CreateProjectOperation = ApiOperation(...);
export const CreateProjectBody = ApiBody(...);
export const CreateProjectResponse201 = ApiResponse(...);
export const CreateProjectResponse403 = ApiResponse(...);

// Update Project Decorators
export const UpdateProjectOperation = ApiOperation(...);
export const UpdateProjectParam = ApiParam(...);
export const UpdateProjectBody = ApiBody(...);
// ... more decorators
```

### 4. Import Organization

Group imports by functionality:

```typescript
import {
  // Create Project
  CreateProjectOperation,
  CreateProjectBody,
  CreateProjectResponse201,
  CreateProjectResponse403,
  // Update Project
  UpdateProjectOperation,
  UpdateProjectParam,
  UpdateProjectBody,
  // ... more imports
} from './projects.swagger';
```

## Benefits Demonstrated

### Before Separation

```typescript
@Controller('projects')
export class ProjectsController {
  @Post()
  @ApiOperation({ summary: 'Create a new project (Admin/Moderator only)' })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({
    status: 201,
    description: 'Project created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        members: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              role: { type: 'string', enum: Object.values(ProjectRole) },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                  username: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    // Business logic buried in documentation
  }
}
```

### After Separation

```typescript
@Controller('projects')
export class ProjectsController {
  @Post()
  @CreateProjectOperation
  @CreateProjectBody
  @CreateProjectResponse201
  @CreateProjectResponse403
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    // Clean, focused business logic
    return this.projectsService.create(createProjectDto, req.user);
  }
}
```

## Migration Steps

1. **Create Swagger file**: `{module}.swagger.ts`
2. **Extract decorators**: Move all `@Api*` decorators to the new file
3. **Export individually**: Each decorator as a named export
4. **Update imports**: Import specific decorators in controller
5. **Apply decorators**: Use imported decorators in controller methods
6. **Test build**: Ensure TypeScript compilation succeeds
7. **Verify documentation**: Check Swagger UI for correct documentation

## Considerations

- **Bundle size**: Slightly larger due to additional imports
- **Learning curve**: Team needs to understand the new pattern
- **Consistency**: Ensure all team members follow the same approach
- **Tooling**: IDE autocomplete works well with named exports

## Conclusion

Separating Swagger documentation improves code organization and maintainability. The Projects controller demonstrates this pattern effectively, making the codebase more professional and easier to maintain.