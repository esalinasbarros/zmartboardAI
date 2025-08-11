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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const projects_service_1 = require("./projects.service");
const dto_1 = require("./dto");
const guards_1 = require("../auth/guards");
const decorators_1 = require("../auth/decorators");
const client_1 = require("@prisma/client");
const projects_swagger_1 = require("./projects.swagger");
let ProjectsController = class ProjectsController {
    projectsService;
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    async createProject(createProjectDto, req) {
        return this.projectsService.createProject(createProjectDto, req.user.id);
    }
    async getUserProjects(req) {
        return this.projectsService.getUserProjects(req.user.id);
    }
    async getAllProjects(req) {
        return this.projectsService.getAllProjects(req.user.id);
    }
    async getProjectById(id, req) {
        return this.projectsService.getProjectById(id, req.user.id);
    }
    async updateProject(id, updateProjectDto, req) {
        return this.projectsService.updateProject(id, updateProjectDto, req.user.id);
    }
    async deleteProject(id, req) {
        return this.projectsService.deleteProject(id, req.user.id);
    }
    async sendInvitation(id, invitationDto, req) {
        return this.projectsService.sendInvitation(id, invitationDto, req.user.id);
    }
    async getProjectInvitations(id, req) {
        return this.projectsService.getProjectInvitations(id, req.user.id);
    }
    async getUserInvitations(req) {
        return this.projectsService.getUserInvitations(req.user.id);
    }
    async respondToInvitation(invitationId, response, req) {
        return this.projectsService.respondToInvitation(invitationId, response, req.user.id);
    }
    async cancelInvitation(invitationId, req) {
        return this.projectsService.cancelInvitation(invitationId, req.user.id);
    }
    async updateProjectMemberRole(id, memberId, updateRoleDto, req) {
        return this.projectsService.updateProjectMemberRole(id, memberId, updateRoleDto.role, req.user.id);
    }
    async removeProjectMember(id, memberId, req) {
        return this.projectsService.removeProjectMember(id, memberId, req.user.id);
    }
};
exports.ProjectsController = ProjectsController;
__decorate([
    projects_swagger_1.CreateProjectOperation,
    projects_swagger_1.CreateProjectBody,
    projects_swagger_1.CreateProjectResponse201,
    projects_swagger_1.CreateProjectResponse403,
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(guards_1.JwtRolesGuard),
    (0, decorators_1.Roles)(client_1.UserRole.MODERATOR, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateProjectDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "createProject", null);
__decorate([
    projects_swagger_1.GetUserProjectsOperation,
    projects_swagger_1.GetUserProjectsResponse200,
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "getUserProjects", null);
__decorate([
    projects_swagger_1.GetAllProjectsOperation,
    projects_swagger_1.GetAllProjectsResponse200,
    projects_swagger_1.GetAllProjectsResponse403,
    (0, common_1.UseGuards)(guards_1.JwtRolesGuard),
    (0, decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN),
    (0, common_1.Get)('admin/all'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "getAllProjects", null);
__decorate([
    projects_swagger_1.GetProjectByIdOperation,
    projects_swagger_1.GetProjectByIdParam,
    projects_swagger_1.GetProjectByIdResponse200,
    projects_swagger_1.GetProjectByIdResponse404,
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "getProjectById", null);
__decorate([
    projects_swagger_1.UpdateProjectOperation,
    projects_swagger_1.UpdateProjectParam,
    projects_swagger_1.UpdateProjectBody,
    projects_swagger_1.UpdateProjectResponse200,
    projects_swagger_1.UpdateProjectResponse403,
    projects_swagger_1.UpdateProjectResponse404,
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateProjectDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "updateProject", null);
__decorate([
    projects_swagger_1.DeleteProjectOperation,
    projects_swagger_1.DeleteProjectParam,
    projects_swagger_1.DeleteProjectResponse200,
    projects_swagger_1.DeleteProjectResponse403,
    projects_swagger_1.DeleteProjectResponse404,
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "deleteProject", null);
__decorate([
    projects_swagger_1.SendInvitationOperation,
    projects_swagger_1.SendInvitationParam,
    projects_swagger_1.SendInvitationBody,
    projects_swagger_1.SendInvitationResponse201,
    projects_swagger_1.SendInvitationResponse403,
    projects_swagger_1.SendInvitationResponse404,
    projects_swagger_1.SendInvitationResponse409,
    (0, common_1.Post)(':id/invitations'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateInvitationDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "sendInvitation", null);
__decorate([
    projects_swagger_1.GetProjectInvitationsOperation,
    projects_swagger_1.GetProjectInvitationsParam,
    projects_swagger_1.GetProjectInvitationsResponse200,
    projects_swagger_1.GetProjectInvitationsResponse403,
    (0, common_1.Get)(':id/invitations'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "getProjectInvitations", null);
__decorate([
    projects_swagger_1.GetUserInvitationsOperation,
    projects_swagger_1.GetUserInvitationsResponse200,
    (0, common_1.Get)('invitations/received'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "getUserInvitations", null);
__decorate([
    projects_swagger_1.RespondToInvitationOperation,
    projects_swagger_1.RespondToInvitationParam,
    projects_swagger_1.RespondToInvitationBody,
    projects_swagger_1.RespondToInvitationResponse200,
    projects_swagger_1.RespondToInvitationResponse403,
    projects_swagger_1.RespondToInvitationResponse404,
    projects_swagger_1.RespondToInvitationResponse400,
    (0, common_1.Post)('invitations/:invitationId/respond'),
    __param(0, (0, common_1.Param)('invitationId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.InvitationResponseDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "respondToInvitation", null);
__decorate([
    projects_swagger_1.CancelInvitationOperation,
    projects_swagger_1.CancelInvitationParam,
    projects_swagger_1.CancelInvitationResponse200,
    projects_swagger_1.CancelInvitationResponse403,
    projects_swagger_1.CancelInvitationResponse404,
    projects_swagger_1.CancelInvitationResponse400,
    (0, common_1.Delete)('invitations/:invitationId'),
    __param(0, (0, common_1.Param)('invitationId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "cancelInvitation", null);
__decorate([
    projects_swagger_1.UpdateProjectMemberRoleOperation,
    projects_swagger_1.UpdateProjectMemberRoleParamId,
    projects_swagger_1.UpdateProjectMemberRoleParamMemberId,
    projects_swagger_1.UpdateProjectMemberRoleBody,
    projects_swagger_1.UpdateProjectMemberRoleResponse200,
    projects_swagger_1.UpdateProjectMemberRoleResponse403,
    projects_swagger_1.UpdateProjectMemberRoleResponse404,
    (0, common_1.Put)(':id/members/:memberId/role'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('memberId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dto_1.UpdateProjectMemberRoleDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "updateProjectMemberRole", null);
__decorate([
    projects_swagger_1.RemoveProjectMemberOperation,
    projects_swagger_1.RemoveProjectMemberParamId,
    projects_swagger_1.RemoveProjectMemberParamMemberId,
    projects_swagger_1.RemoveProjectMemberResponse200,
    projects_swagger_1.RemoveProjectMemberResponse403,
    projects_swagger_1.RemoveProjectMemberResponse404,
    projects_swagger_1.RemoveProjectMemberResponse400,
    (0, common_1.Delete)(':id/members/:memberId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('memberId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "removeProjectMember", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, swagger_1.ApiTags)('projects'),
    (0, common_1.Controller)('projects'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiCookieAuth)(),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsController);
//# sourceMappingURL=projects.controller.js.map