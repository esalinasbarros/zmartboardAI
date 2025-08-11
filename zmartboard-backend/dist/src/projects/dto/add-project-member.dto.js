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
exports.UpdateProjectMemberRoleDto = exports.AddProjectMemberDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class AddProjectMemberDto {
    userId;
    role;
}
exports.AddProjectMemberDto = AddProjectMemberDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID to add to the project',
        example: 'clx1234567890',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddProjectMemberDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Role for the user in the project',
        enum: client_1.ProjectRole,
        example: client_1.ProjectRole.DEVELOPER,
    }),
    (0, class_validator_1.IsEnum)(client_1.ProjectRole),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddProjectMemberDto.prototype, "role", void 0);
class UpdateProjectMemberRoleDto {
    role;
}
exports.UpdateProjectMemberRoleDto = UpdateProjectMemberRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New role for the project member',
        enum: client_1.ProjectRole,
        example: client_1.ProjectRole.ADMIN,
    }),
    (0, class_validator_1.IsEnum)(client_1.ProjectRole),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateProjectMemberRoleDto.prototype, "role", void 0);
//# sourceMappingURL=add-project-member.dto.js.map