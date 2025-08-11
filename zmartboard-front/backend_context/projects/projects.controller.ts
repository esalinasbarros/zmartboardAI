import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import {
  CreateProjectDto,
  UpdateProjectDto,
  UpdateProjectMemberRoleDto,
  CreateInvitationDto,
  InvitationResponseDto,
} from './dto';
import { JwtAuthGuard, JwtRolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { UserRole, ProjectRole } from '@prisma/client';
import { AuthenticatedRequest } from '../types/authenticated-request.type';

import {
  CreateProjectOperation,
  CreateProjectBody,
  CreateProjectResponse201,
  CreateProjectResponse403,
  GetUserProjectsOperation,
  GetUserProjectsResponse200,
  GetAllProjectsOperation,
  GetAllProjectsResponse200,
  GetAllProjectsResponse403,
  GetProjectByIdOperation,
  GetProjectByIdParam,
  GetProjectByIdResponse200,
  GetProjectByIdResponse404,
  UpdateProjectOperation,
  UpdateProjectParam,
  UpdateProjectBody,
  UpdateProjectResponse200,
  UpdateProjectResponse403,
  UpdateProjectResponse404,
  DeleteProjectOperation,
  DeleteProjectParam,
  DeleteProjectResponse200,
  DeleteProjectResponse403,
  DeleteProjectResponse404,
  SendInvitationOperation,
  SendInvitationParam,
  SendInvitationBody,
  SendInvitationResponse201,
  SendInvitationResponse403,
  SendInvitationResponse404,
  SendInvitationResponse409,
  GetProjectInvitationsOperation,
  GetProjectInvitationsParam,
  GetProjectInvitationsResponse200,
  GetProjectInvitationsResponse403,
  GetUserInvitationsOperation,
  GetUserInvitationsResponse200,
  RespondToInvitationOperation,
  RespondToInvitationParam,
  RespondToInvitationBody,
  RespondToInvitationResponse200,
  RespondToInvitationResponse403,
  RespondToInvitationResponse404,
  RespondToInvitationResponse400,
  CancelInvitationOperation,
  CancelInvitationParam,
  CancelInvitationResponse200,
  CancelInvitationResponse403,
  CancelInvitationResponse404,
  CancelInvitationResponse400,
  UpdateProjectMemberRoleOperation,
  UpdateProjectMemberRoleParamId,
  UpdateProjectMemberRoleParamMemberId,
  UpdateProjectMemberRoleBody,
  UpdateProjectMemberRoleResponse200,
  UpdateProjectMemberRoleResponse403,
  UpdateProjectMemberRoleResponse404,
  RemoveProjectMemberOperation,
  RemoveProjectMemberParamId,
  RemoveProjectMemberParamMemberId,
  RemoveProjectMemberResponse200,
  RemoveProjectMemberResponse403,
  RemoveProjectMemberResponse404,
  RemoveProjectMemberResponse400,
} from './projects.swagger';

// Base endpoint
// 'api/projects/

@ApiTags('projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiCookieAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @CreateProjectOperation
  @CreateProjectBody
  @CreateProjectResponse201
  @CreateProjectResponse403
  // ---------------------------------------------
  @Post()
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.projectsService.createProject(createProjectDto, req.user.id);
  }

  @GetUserProjectsOperation
  @GetUserProjectsResponse200
  // ---------------------------------------------
  @Get()
  async getUserProjects(@Request() req: AuthenticatedRequest) {
    return this.projectsService.getUserProjects(req.user.id);
  }

  @GetAllProjectsOperation
  @GetAllProjectsResponse200
  @GetAllProjectsResponse403
  // ---------------------------------------------
  @UseGuards(JwtRolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('admin/all')
  async getAllProjects(@Request() req: AuthenticatedRequest) {
    return this.projectsService.getAllProjects(req.user.id);
  }

  @GetProjectByIdOperation
  @GetProjectByIdParam
  @GetProjectByIdResponse200
  @GetProjectByIdResponse404
  // ---------------------------------------------
  @Get(':id')
  async getProjectById(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.projectsService.getProjectById(id, req.user.id);
  }

  @UpdateProjectOperation
  @UpdateProjectParam
  @UpdateProjectBody
  @UpdateProjectResponse200
  @UpdateProjectResponse403
  @UpdateProjectResponse404
  // ---------------------------------------------
  @Put(':id')
  async updateProject(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.projectsService.updateProject(id, updateProjectDto, req.user.id);
  }

  @DeleteProjectOperation
  @DeleteProjectParam
  @DeleteProjectResponse200
  @DeleteProjectResponse403
  @DeleteProjectResponse404
  // ---------------------------------------------
  @Delete(':id')
  async deleteProject(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.projectsService.deleteProject(id, req.user.id);
  }

  @SendInvitationOperation
  @SendInvitationParam
  @SendInvitationBody
  @SendInvitationResponse201
  @SendInvitationResponse403
  @SendInvitationResponse404
  @SendInvitationResponse409
  // ---------------------------------------------
  @Post(':id/invitations')
  async sendInvitation(
    @Param('id') id: string,
    @Body() invitationDto: CreateInvitationDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.projectsService.sendInvitation(id, invitationDto, req.user.id);
  }

  @GetProjectInvitationsOperation
  @GetProjectInvitationsParam
  @GetProjectInvitationsResponse200
  @GetProjectInvitationsResponse403
  // ---------------------------------------------
  @Get(':id/invitations')
  async getProjectInvitations(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.projectsService.getProjectInvitations(id, req.user.id);
  }

  @GetUserInvitationsOperation
  @GetUserInvitationsResponse200
  // ---------------------------------------------
  @Get('invitations/received')
  async getUserInvitations(@Request() req: AuthenticatedRequest) {
    return this.projectsService.getUserInvitations(req.user.id);
  }

  @RespondToInvitationOperation
  @RespondToInvitationParam
  @RespondToInvitationBody
  @RespondToInvitationResponse200
  @RespondToInvitationResponse403
  @RespondToInvitationResponse404
  @RespondToInvitationResponse400
  // ---------------------------------------------
  @Post('invitations/:invitationId/respond')
  async respondToInvitation(
    @Param('invitationId') invitationId: string,
    @Body() response: InvitationResponseDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.projectsService.respondToInvitation(invitationId, response, req.user.id);
  }

  @CancelInvitationOperation
  @CancelInvitationParam
  @CancelInvitationResponse200
  @CancelInvitationResponse403
  @CancelInvitationResponse404
  @CancelInvitationResponse400
  // ---------------------------------------------
  @Delete('invitations/:invitationId')
  async cancelInvitation(
    @Param('invitationId') invitationId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.projectsService.cancelInvitation(invitationId, req.user.id);
  }

  @UpdateProjectMemberRoleOperation
  @UpdateProjectMemberRoleParamId
  @UpdateProjectMemberRoleParamMemberId
  @UpdateProjectMemberRoleBody
  @UpdateProjectMemberRoleResponse200
  @UpdateProjectMemberRoleResponse403
  @UpdateProjectMemberRoleResponse404
  // ---------------------------------------------
  @Put(':id/members/:memberId/role')
  async updateProjectMemberRole(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body() updateRoleDto: UpdateProjectMemberRoleDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.projectsService.updateProjectMemberRole(
      id,
      memberId,
      updateRoleDto.role,
      req.user.id,
    );
  }

  @RemoveProjectMemberOperation
  @RemoveProjectMemberParamId
  @RemoveProjectMemberParamMemberId
  @RemoveProjectMemberResponse200
  @RemoveProjectMemberResponse403
  @RemoveProjectMemberResponse404
  @RemoveProjectMemberResponse400
  // ---------------------------------------------
  @Delete(':id/members/:memberId')
  async removeProjectMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.projectsService.removeProjectMember(id, memberId, req.user.id);
  }
}