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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationDto = exports.InvitationResponseDto = exports.CreateInvitationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateInvitationDto {
    email;
    role = client_1.ProjectRole.DEVELOPER;
}
exports.CreateInvitationDto = CreateInvitationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email of the user to invite',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateInvitationDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Role to assign to the invited user',
        enum: client_1.ProjectRole,
        example: client_1.ProjectRole.DEVELOPER,
        default: client_1.ProjectRole.DEVELOPER,
    }),
    (0, class_validator_1.IsEnum)(client_1.ProjectRole),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvitationDto.prototype, "role", void 0);
class InvitationResponseDto {
    response;
}
exports.InvitationResponseDto = InvitationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response to the invitation',
        enum: ['accept', 'reject'],
        example: 'accept',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(['accept', 'reject']),
    __metadata("design:type", String)
], InvitationResponseDto.prototype, "response", void 0);
class InvitationDto {
    id;
    projectId;
    projectTitle;
    sender;
    receiver;
    role;
    status;
    expiresAt;
    createdAt;
    updatedAt;
}
exports.InvitationDto = InvitationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Invitation ID',
        example: 'clp1234567890',
    }),
    __metadata("design:type", String)
], InvitationDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Project ID',
        example: 'clp1234567890',
    }),
    __metadata("design:type", String)
], InvitationDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Project title',
        example: 'My Project',
    }),
    __metadata("design:type", String)
], InvitationDto.prototype, "projectTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sender information',
        type: 'object',
        properties: {
            id: { type: 'string', example: 'clp1234567890' },
            username: { type: 'string', example: 'john_doe' },
            email: { type: 'string', example: 'john@example.com' },
        },
    }),
    __metadata("design:type", Object)
], InvitationDto.prototype, "sender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Receiver information',
        type: 'object',
        properties: {
            id: { type: 'string', example: 'clp1234567890' },
            username: { type: 'string', example: 'jane_doe' },
            email: { type: 'string', example: 'jane@example.com' },
        },
    }),
    __metadata("design:type", Object)
], InvitationDto.prototype, "receiver", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Role to be assigned',
        enum: client_1.ProjectRole,
        example: client_1.ProjectRole.DEVELOPER,
    }),
    __metadata("design:type", String)
], InvitationDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Invitation status',
        enum: client_1.InvitationStatus,
        example: client_1.InvitationStatus.PENDING,
    }),
    __metadata("design:type", String)
], InvitationDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Invitation expiration date',
        example: '2024-12-31T23:59:59.000Z',
    }),
    __metadata("design:type", Date)
], InvitationDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Invitation creation date',
        example: '2024-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], InvitationDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Invitation last update date',
        example: '2024-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], InvitationDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=invitation.dto.js.map