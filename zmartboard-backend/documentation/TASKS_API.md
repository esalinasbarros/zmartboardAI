# Tasks API Documentation

This document provides comprehensive documentation for the Tasks API, which manages individual tasks within Kanban board columns.

## Overview

The Tasks API allows you to manage tasks within board columns. Tasks are the individual work items that can be created, updated, deleted, and moved between columns.

### Data Model Hierarchy

```
Project
└── Board (title, description)
    └── Column (name, position)
        └── Task (title, description, position)
```

### Access Control

- **Project Members**: Can create, update, delete, and move tasks
- **Non-members**: No access to project tasks

## Authentication

All endpoints require authentication via JWT token. Include the token in one of the following ways:

- **Cookie**: `access_token` (HTTP-only cookie)
- **Header**: `Authorization: Bearer <token>`

## API Endpoints

### Tasks

#### Get Task by ID

```http
GET /tasks/{taskId}
```

**Description**: Retrieve a specific task by its ID. Any project member can view tasks.

**Parameters**:
- `taskId` (path): Task ID

**Response** (200):
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

**Error Responses**:
- `403`: You are not a member of this project
- `404`: Task not found

#### Create Task

```http
POST /tasks/columns/{columnId}
```

**Description**: Create a new task in a column. Any project member can create tasks.

**Parameters**:
- `columnId` (path): Column ID where the task will be created

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

**Error Responses**:
- `403`: You are not a member of this project
- `404`: Column not found

#### Update Task

```http
PUT /tasks/{taskId}
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

**Response** (200):
```json
{
  "id": "clp3456789012",
  "title": "Updated task title",
  "description": "Updated task description",
  "position": 0,
  "columnId": "clp2345678901",
  "createdAt": "2024-01-15T10:40:00Z",
  "updatedAt": "2024-01-15T10:45:00Z"
}
```

**Error Responses**:
- `403`: You are not a member of this project
- `404`: Task not found

#### Delete Task

```http
DELETE /tasks/{taskId}
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

**Error Responses**:
- `403`: You are not a member of this project
- `404`: Task not found

#### Move Task

```http
PATCH /tasks/{taskId}/move
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

**Note**: `targetColumnId` is optional. If not provided, the task will be moved within the same column.

**Response** (200):
```json
{
  "id": "clp3456789012",
  "title": "Implement user authentication",
  "description": "Create JWT-based auth system",
  "position": 1,
  "columnId": "clp2345678902",
  "createdAt": "2024-01-15T10:40:00Z",
  "updatedAt": "2024-01-15T10:50:00Z"
}
```

**Error Responses**:
- `400`: Cannot move task to a column in a different board
- `403`: You are not a member of this project
- `404`: Task or target column not found

#### Archive Task

```http
PATCH /tasks/{taskId}/archive
```

**Description**: Archive a task. Any project member can archive tasks.

**Parameters**:
- `taskId` (path): Task ID

**Response** (200):
```json
{
  "message": "Task archived successfully",
  "task": {
    "id": "clp3456789012",
    "title": "Implement user authentication",
    "description": "Create JWT-based auth system",
    "position": 0,
    "columnId": "clp2345678901",
    "archived": true,
    "deadline": null,
    "createdAt": "2024-01-15T10:40:00Z",
    "updatedAt": "2024-01-15T10:55:00Z"
  }
}
```

**Error Responses**:
- `400`: Task is already archived
- `403`: You are not a member of this project
- `404`: Task not found

#### Unarchive Task

```http
PATCH /tasks/{taskId}/unarchive
```

**Description**: Unarchive a task. Any project member can unarchive tasks.

**Parameters**:
- `taskId` (path): Task ID

**Response** (200):
```json
{
  "message": "Task unarchived successfully",
  "task": {
    "id": "clp3456789012",
    "title": "Implement user authentication",
    "description": "Create JWT-based auth system",
    "position": 0,
    "columnId": "clp2345678901",
    "archived": false,
    "deadline": null,
    "createdAt": "2024-01-15T10:40:00Z",
    "updatedAt": "2024-01-15T10:57:00Z"
  }
}
```

**Error Responses**:
- `400`: Task is not archived
- `403`: You are not a member of this project
- `404`: Task not found

## Request/Response Details

### Task Object

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "position": "number",
  "columnId": "string",
  "archived": "boolean",
  "deadline": "string (ISO 8601) | null",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

### Validation Rules

#### Create/Update Task
- `title`: Required, maximum 200 characters
- `description`: Optional, maximum 1000 characters
- `position`: Optional integer, minimum 0 (auto-assigned if not provided)

#### Move Task
- `position`: Required integer, minimum 0
- `targetColumnId`: Optional string (if not provided, moves within same column)

## Error Handling

The API uses standard HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors, invalid move operations)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (not a project member)
- `404`: Not Found (task, column, or related resources don't exist)

### Common Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## Usage Examples

### Creating a Task

```bash
curl -X POST "http://localhost:3000/tasks/columns/clp2345678901" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement user authentication",
    "description": "Create JWT-based auth system",
    "position": 0
  }'
```

### Moving a Task to Different Column

```bash
curl -X PATCH "http://localhost:3000/tasks/clp3456789012/move" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "targetColumnId": "clp2345678902",
    "position": 1
  }'
```

### Moving a Task Within Same Column

```bash
curl -X PATCH "http://localhost:3000/tasks/clp3456789012/move" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "position": 2
  }'
```

### Archiving a Task

```bash
curl -X PATCH "http://localhost:3000/tasks/clp3456789012/archive" \
  -H "Authorization: Bearer <token>"
```

### Unarchiving a Task

```bash
curl -X PATCH "http://localhost:3000/tasks/clp3456789012/unarchive" \
  -H "Authorization: Bearer <token>"
```

## Best Practices

1. **Position Management**: When creating tasks without specifying position, they are automatically placed at the end
2. **Atomic Operations**: Move operations are performed atomically to maintain data consistency
3. **Validation**: Always validate that target columns belong to the same board when moving tasks
4. **Error Handling**: Implement proper error handling for network failures and validation errors
5. **Real-time Updates**: Consider implementing WebSocket connections for real-time task updates in collaborative environments

## Integration Notes

- Tasks are automatically repositioned when other tasks are moved or deleted
- Position values are automatically managed by the system to maintain consistency
- All task operations respect project membership permissions
- Task moves between columns are validated to ensure they belong to the same board