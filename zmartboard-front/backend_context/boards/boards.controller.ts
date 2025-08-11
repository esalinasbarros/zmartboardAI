import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BoardsService } from './boards.service';
import {
  CreateBoardDto,
  UpdateBoardDto,
  CreateColumnDto,
  UpdateColumnDto,
  MoveColumnDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../types/authenticated-request.type';
import {
  BoardsBearerAuth,
  BoardsCookieAuth,
  CreateBoardOperation,
  CreateBoardParam,
  CreateBoardSuccessResponse,
  CreateBoardForbiddenResponse,
  CreateBoardNotFoundResponse,
  GetProjectBoardsOperation,
  GetProjectBoardsParam,
  GetProjectBoardsSuccessResponse,
  GetProjectBoardsForbiddenResponse,
  GetBoardByIdOperation,
  GetBoardByIdParam,
  GetBoardByIdSuccessResponse,
  GetBoardByIdForbiddenResponse,
  GetBoardByIdNotFoundResponse,
  UpdateBoardOperation,
  UpdateBoardParam,
  UpdateBoardSuccessResponse,
  UpdateBoardForbiddenResponse,
  UpdateBoardNotFoundResponse,
  DeleteBoardOperation,
  DeleteBoardParam,
  DeleteBoardSuccessResponse,
  DeleteBoardForbiddenResponse,
  DeleteBoardNotFoundResponse,
  CreateColumnOperation,
  CreateColumnParam,
  CreateColumnSuccessResponse,
  CreateColumnForbiddenResponse,
  CreateColumnNotFoundResponse,
  UpdateColumnOperation,
  UpdateColumnParam,
  UpdateColumnSuccessResponse,
  UpdateColumnForbiddenResponse,
  UpdateColumnNotFoundResponse,
  DeleteColumnOperation,
  DeleteColumnParam,
  DeleteColumnSuccessResponse,
  DeleteColumnForbiddenResponse,
  DeleteColumnNotFoundResponse,
  MoveColumnOperation,
  MoveColumnParam,
  MoveColumnSuccessResponse,
  MoveColumnForbiddenResponse,
  MoveColumnNotFoundResponse,

} from './boards.swagger';

@ApiTags('boards')
@Controller('boards')
@UseGuards(JwtAuthGuard)
@BoardsBearerAuth
@BoardsCookieAuth
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  // Board endpoints
  @CreateBoardOperation
  @CreateBoardParam
  @CreateBoardSuccessResponse
  @CreateBoardForbiddenResponse
  @CreateBoardNotFoundResponse
  @Post('projects/:projectId')
  async createBoard(
    @Param('projectId') projectId: string,
    @Body() createBoardDto: CreateBoardDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.boardsService.createBoard(projectId, createBoardDto, req.user.id);
  }

  @GetProjectBoardsOperation
  @GetProjectBoardsParam
  @GetProjectBoardsSuccessResponse
  @GetProjectBoardsForbiddenResponse
  @Get('projects/:projectId')
  async getProjectBoards(@Param('projectId') projectId: string, @Request() req: AuthenticatedRequest) {
    return this.boardsService.getProjectBoards(projectId, req.user.id);
  }

  @GetBoardByIdOperation
  @GetBoardByIdParam
  @GetBoardByIdSuccessResponse
  @GetBoardByIdForbiddenResponse
  @GetBoardByIdNotFoundResponse
  @Get(':boardId')
  async getBoardById(@Param('boardId') boardId: string, @Request() req: AuthenticatedRequest) {
    return this.boardsService.getBoardById(boardId, req.user.id);
  }

  @UpdateBoardOperation
  @UpdateBoardParam
  @UpdateBoardSuccessResponse
  @UpdateBoardForbiddenResponse
  @UpdateBoardNotFoundResponse
  @Put(':boardId')
  async updateBoard(
    @Param('boardId') boardId: string,
    @Body() updateBoardDto: UpdateBoardDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.boardsService.updateBoard(boardId, updateBoardDto, req.user.id);
  }

  @DeleteBoardOperation
  @DeleteBoardParam
  @DeleteBoardSuccessResponse
  @DeleteBoardForbiddenResponse
  @DeleteBoardNotFoundResponse
  @Delete(':boardId')
  async deleteBoard(@Param('boardId') boardId: string, @Request() req: AuthenticatedRequest) {
    return this.boardsService.deleteBoard(boardId, req.user.id);
  }

  // Column endpoints
  @CreateColumnOperation
  @CreateColumnParam
  @CreateColumnSuccessResponse
  @CreateColumnForbiddenResponse
  @CreateColumnNotFoundResponse
  @Post(':boardId/columns')
  async createColumn(
    @Param('boardId') boardId: string,
    @Body() createColumnDto: CreateColumnDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.boardsService.createColumn(boardId, createColumnDto, req.user.id);
  }

  @UpdateColumnOperation
  @UpdateColumnParam
  @UpdateColumnSuccessResponse
  @UpdateColumnForbiddenResponse
  @UpdateColumnNotFoundResponse
  @Put('columns/:columnId')
  async updateColumn(
    @Param('columnId') columnId: string,
    @Body() updateColumnDto: UpdateColumnDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.boardsService.updateColumn(columnId, updateColumnDto, req.user.id);
  }

  @DeleteColumnOperation
  @DeleteColumnParam
  @DeleteColumnSuccessResponse
  @DeleteColumnForbiddenResponse
  @DeleteColumnNotFoundResponse
  @Delete('columns/:columnId')
  async deleteColumn(@Param('columnId') columnId: string, @Request() req: AuthenticatedRequest) {
    return this.boardsService.deleteColumn(columnId, req.user.id);
  }

  @MoveColumnOperation
  @MoveColumnParam
  @MoveColumnSuccessResponse
  @MoveColumnForbiddenResponse
  @MoveColumnNotFoundResponse
  @Patch('columns/:columnId/move')
  async moveColumn(
    @Param('columnId') columnId: string,
    @Body() moveColumnDto: MoveColumnDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.boardsService.moveColumn(columnId, moveColumnDto, req.user.id);
  }


}