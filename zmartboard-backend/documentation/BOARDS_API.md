# Boards API Documentation

This document provides comprehensive documentation for the Kanban Boards API, including boards, columns, and tasks management.

## Overview

The Boards API allows you to manage Kanban-style boards within projects. Each project can have multiple boards, each board contains columns, and each column contains tasks.

### Data Model Hierarchy

```
Project
└── Board (title, description)
    └── Column (name, position)
        └── Task (title, description, position)
```

### Access Control

- **Project Admins**: Can create, update, and delete boards and columns
- **Project Members**: Can create, update, delete, and move tasks
- **Non-members**: No access to project boards

## Authentication

All endpoints require authentication via JWT token. Include the token in one of the following ways:

- **Cookie**: `access_token` (HTTP-only cookie)
- **Header**: `Authorization: Bearer <token>`

## API Endpoints

### Boards

#### Create Board

```http
POST /boards/projects/{projectId}
```

**Description**: Create a new board in a project. Only project admins can create boards.

**Parameters**:
- `projectId` (path): Project ID

**Request Body**:
```json
{
  "title": "Sprint Planning Board",
  "description": "Board for managing sprint tasks"
}
```

**Response** (201):
```json
{
  "id": "clp1234567890",
  "title": "Sprint Planning Board",
  "description": "Board for managing sprint tasks",
  "projectId": "clp1234567890",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "columns": []
}
```

**Error Responses**:
- `403`: Only project admins can create boards
- `404`: Project not found

#### Get Project Boards

```http
GET /boards/projects/{projectId}
```

**Description**: Retrieve all boards for a specific project.

**Parameters**:
- `projectId` (path): Project ID

**Response** (200):
```json
[
  {
    "id": "clp1234567890",
    "title": "Sprint Planning Board",
    "description": "Board for managing sprint tasks",
    "projectId": "clp1234567890",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "columns": [
      {
        "id": "clp2345678901",
        "name": "To Do",
        "position": 0,
        "tasks": []
      }
    ]
  }
]
```

#### Get Board by ID

```http
GET /boards/{boardId}
```

**Description**: Retrieve a specific board with all its columns and tasks.

**Parameters**:
- `boardId` (path): Board ID

**Response** (200):
```json
{
  "id": "clp1234567890",
  "title": "Sprint Planning Board",
  "description": "Board for managing sprint tasks",
  "projectId": "clp1234567890",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "columns": [
    {
      "id": "clp2345678901",
      "name": "To Do",
      "position": 0,
      "tasks": [
        {
          "id": "clp3456789012",
          "title": "Implement user authentication",
          "description": "Create JWT-based auth system",
          "position": 0
        }
      ]
    }
  ]
}
```

#### Update Board

```http
PUT /boards/{boardId}
```

**Description**: Update board details. Only project admins can update boards.

**Parameters**:
- `boardId` (path): Board ID

**Request Body**:
```json
{
  "title": "Updated Board Title",
  "description": "Updated description"
}
```

#### Delete Board

```http
DELETE /boards/{boardId}
```

**Description**: Delete a board and all its columns and tasks. Only project admins can delete boards.

**Parameters**:
- `boardId` (path): Board ID

**Response** (200):
```json
{
  "message": "Board deleted successfully"
}
```

### Columns

#### Create Column

```http
POST /boards/{boardId}/columns
```

**Description**: Create a new column in a board. Only project admins can create columns.

**Parameters**:
- `boardId` (path): Board ID

**Request Body**:
```json
{
  "name": "To Do",
  "position": 0
}
```

**Response** (201):
```json
{
  "id": "clp2345678901",
  "name": "To Do",
  "position": 0,
  "boardId": "clp1234567890",
  "createdAt": "2024-01-15T10:35:00Z",
  "updatedAt": "2024-01-15T10:35:00Z",
  "tasks": []
}
```

#### Update Column

```http
PUT /boards/columns/{columnId}
```

**Description**: Update column details. Only project admins can update columns.

**Parameters**:
- `columnId` (path): Column ID

**Request Body**:
```json
{
  "name": "In Progress"
}
```

#### Delete Column

```http
DELETE /boards/columns/{columnId}
```

**Description**: Delete a column and all its tasks. Only project admins can delete columns.

**Parameters**:
- `columnId` (path): Column ID

**Response** (200):
```json
{
  "message": "Column deleted successfully"
}
```

#### Move Column

```http
PATCH /boards/columns/{columnId}/move
```

**Description**: Change the position of a column within a board. Only project admins can move columns.

**Parameters**:
- `columnId` (path): Column ID

**Request Body**:
```json
{
  "position": 2
}
```

### Tasks

#### Create Task

```http
POST /boards/columns/{columnId}/tasks
```

**Description**: Create a new task in a column. Any project member can create tasks.

**Parameters**:
- `columnId` (path): Column ID

**Request Body**:
```json
{
  "title": "Implement user authentication",
  "description": "Create JWT-based auth system",
  "position": 0
}
```

**Response** (201):
```json
{
  "id": "clp3456789012",
  "title": "Implement user authentication",
  "description": "Create JWT-based auth system",
  "position": 0,
  "columnId": "clp2345678901",
  "createdAt": "2024-01-15T10:40:00Z",
  "updatedAt": "2024-01-15T10:40:00Z"
}
```

#### Update Task

```http
PUT /boards/tasks/{taskId}
```

**Description**: Update task details. Any project member can update tasks.

**Parameters**:
- `taskId` (path): Task ID

**Request Body**:
```json
{
  "title": "Updated task title",
  "description": "Updated task description"
}
```

#### Delete Task

```http
DELETE /boards/tasks/{taskId}
```

**Description**: Delete a task. Any project member can delete tasks.

**Parameters**:
- `taskId` (path): Task ID

**Response** (200):
```json
{
  "message": "Task deleted successfully"
}
```

#### Move Task

```http
PATCH /boards/tasks/{taskId}/move
```

**Description**: Move a task within the same column or to a different column. Any project member can move tasks.

**Parameters**:
- `taskId` (path): Task ID

**Request Body**:
```json
{
  "targetColumnId": "clp2345678902",
  "position": 1
}
```

**Note**: If `targetColumnId` is not provided, the task will be moved within the same column.

## Data Validation

### Board Validation
- `title`: Required, maximum 100 characters
- `description`: Optional, maximum 500 characters

### Column Validation
- `name`: Required, maximum 50 characters
- `position`: Optional integer, minimum 0 (auto-assigned if not provided)

### Task Validation
- `title`: Required, maximum 200 characters
- `description`: Optional, maximum 1000 characters
- `position`: Optional integer, minimum 0 (auto-assigned if not provided)

### Move Validation
- `position`: Required integer, minimum 0
- `targetColumnId`: Optional string (for task moves only)

## Error Handling

The API uses standard HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource doesn't exist)
- `409`: Conflict (duplicate position or other conflicts)
- `500`: Internal Server Error

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## Position Management

Both columns and tasks use position-based ordering:

- Positions start from 0
- When creating without specifying position, items are added at the end
- When moving items, positions are automatically adjusted to maintain consistency
- Duplicate positions within the same container are not allowed

## Examples

### Creating a Complete Board Structure

1. **Create a board**:
```bash
curl -X POST "http://localhost:3000/boards/projects/clp1234567890" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sprint 1 Board",
    "description": "First sprint planning board"
  }'
```

2. **Add columns**:
```bash
# To Do column
curl -X POST "http://localhost:3000/boards/clp1234567890/columns" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "To Do",
    "position": 0
  }'

# In Progress column
curl -X POST "http://localhost:3000/boards/clp1234567890/columns" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "In Progress",
    "position": 1
  }'

# Done column
curl -X POST "http://localhost:3000/boards/clp1234567890/columns" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Done",
    "position": 2
  }'
```

3. **Add tasks**:
```bash
curl -X POST "http://localhost:3000/boards/columns/clp2345678901/tasks" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Setup project structure",
    "description": "Initialize NestJS project with basic modules",
    "position": 0
  }'
```

4. **Move task between columns**:
```bash
curl -X PATCH "http://localhost:3000/boards/tasks/clp3456789012/move" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "targetColumnId": "clp2345678902",
    "position": 0
  }'
```

## Best Practices

1. **Always check permissions**: Ensure users have appropriate access before performing operations
2. **Handle position conflicts**: When moving items, be prepared to handle position conflicts
3. **Validate relationships**: Ensure boards belong to projects, columns belong to boards, etc.
4. **Use transactions**: For operations that affect multiple items (like moving), use database transactions
5. **Implement optimistic locking**: Consider implementing version control for concurrent updates

## Integration with Frontend

This API is designed to work seamlessly with Kanban board frontends:

- Drag-and-drop operations map to move endpoints
- Real-time updates can be implemented using WebSockets (future enhancement)
- Position-based ordering ensures consistent visual representation
- Comprehensive error handling provides clear feedback to users