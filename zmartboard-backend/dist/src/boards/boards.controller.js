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
exports.BoardsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const boards_service_1 = require("./boards.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const boards_swagger_1 = require("./boards.swagger");
let BoardsController = class BoardsController {
    boardsService;
    constructor(boardsService) {
        this.boardsService = boardsService;
    }
    async createBoard(projectId, createBoardDto, req) {
        return this.boardsService.createBoard(projectId, createBoardDto, req.user.id);
    }
    async getProjectBoards(projectId, req) {
        return this.boardsService.getProjectBoards(projectId, req.user.id);
    }
    async getBoardById(boardId, req) {
        return this.boardsService.getBoardById(boardId, req.user.id);
    }
    async updateBoard(boardId, updateBoardDto, req) {
        return this.boardsService.updateBoard(boardId, updateBoardDto, req.user.id);
    }
    async deleteBoard(boardId, req) {
        return this.boardsService.deleteBoard(boardId, req.user.id);
    }
    async createColumn(boardId, createColumnDto, req) {
        return this.boardsService.createColumn(boardId, createColumnDto, req.user.id);
    }
    async updateColumn(columnId, updateColumnDto, req) {
        return this.boardsService.updateColumn(columnId, updateColumnDto, req.user.id);
    }
    async deleteColumn(columnId, req) {
        return this.boardsService.deleteColumn(columnId, req.user.id);
    }
    async moveColumn(columnId, moveColumnDto, req) {
        return this.boardsService.moveColumn(columnId, moveColumnDto, req.user.id);
    }
};
exports.BoardsController = BoardsController;
__decorate([
    boards_swagger_1.CreateBoardOperation,
    boards_swagger_1.CreateBoardParam,
    boards_swagger_1.CreateBoardSuccessResponse,
    boards_swagger_1.CreateBoardForbiddenResponse,
    boards_swagger_1.CreateBoardNotFoundResponse,
    (0, common_1.Post)('projects/:projectId'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateBoardDto, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "createBoard", null);
__decorate([
    boards_swagger_1.GetProjectBoardsOperation,
    boards_swagger_1.GetProjectBoardsParam,
    boards_swagger_1.GetProjectBoardsSuccessResponse,
    boards_swagger_1.GetProjectBoardsForbiddenResponse,
    (0, common_1.Get)('projects/:projectId'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "getProjectBoards", null);
__decorate([
    boards_swagger_1.GetBoardByIdOperation,
    boards_swagger_1.GetBoardByIdParam,
    boards_swagger_1.GetBoardByIdSuccessResponse,
    boards_swagger_1.GetBoardByIdForbiddenResponse,
    boards_swagger_1.GetBoardByIdNotFoundResponse,
    (0, common_1.Get)(':boardId'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "getBoardById", null);
__decorate([
    boards_swagger_1.UpdateBoardOperation,
    boards_swagger_1.UpdateBoardParam,
    boards_swagger_1.UpdateBoardSuccessResponse,
    boards_swagger_1.UpdateBoardForbiddenResponse,
    boards_swagger_1.UpdateBoardNotFoundResponse,
    (0, common_1.Put)(':boardId'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateBoardDto, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "updateBoard", null);
__decorate([
    boards_swagger_1.DeleteBoardOperation,
    boards_swagger_1.DeleteBoardParam,
    boards_swagger_1.DeleteBoardSuccessResponse,
    boards_swagger_1.DeleteBoardForbiddenResponse,
    boards_swagger_1.DeleteBoardNotFoundResponse,
    (0, common_1.Delete)(':boardId'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "deleteBoard", null);
__decorate([
    boards_swagger_1.CreateColumnOperation,
    boards_swagger_1.CreateColumnParam,
    boards_swagger_1.CreateColumnSuccessResponse,
    boards_swagger_1.CreateColumnForbiddenResponse,
    boards_swagger_1.CreateColumnNotFoundResponse,
    (0, common_1.Post)(':boardId/columns'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateColumnDto, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "createColumn", null);
__decorate([
    boards_swagger_1.UpdateColumnOperation,
    boards_swagger_1.UpdateColumnParam,
    boards_swagger_1.UpdateColumnSuccessResponse,
    boards_swagger_1.UpdateColumnForbiddenResponse,
    boards_swagger_1.UpdateColumnNotFoundResponse,
    (0, common_1.Put)('columns/:columnId'),
    __param(0, (0, common_1.Param)('columnId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateColumnDto, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "updateColumn", null);
__decorate([
    boards_swagger_1.DeleteColumnOperation,
    boards_swagger_1.DeleteColumnParam,
    boards_swagger_1.DeleteColumnSuccessResponse,
    boards_swagger_1.DeleteColumnForbiddenResponse,
    boards_swagger_1.DeleteColumnNotFoundResponse,
    (0, common_1.Delete)('columns/:columnId'),
    __param(0, (0, common_1.Param)('columnId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "deleteColumn", null);
__decorate([
    boards_swagger_1.MoveColumnOperation,
    boards_swagger_1.MoveColumnParam,
    boards_swagger_1.MoveColumnSuccessResponse,
    boards_swagger_1.MoveColumnForbiddenResponse,
    boards_swagger_1.MoveColumnNotFoundResponse,
    (0, common_1.Patch)('columns/:columnId/move'),
    __param(0, (0, common_1.Param)('columnId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.MoveColumnDto, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "moveColumn", null);
exports.BoardsController = BoardsController = __decorate([
    (0, swagger_1.ApiTags)('boards'),
    (0, common_1.Controller)('boards'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    boards_swagger_1.BoardsBearerAuth,
    boards_swagger_1.BoardsCookieAuth,
    __metadata("design:paramtypes", [boards_service_1.BoardsService])
], BoardsController);
//# sourceMappingURL=boards.controller.js.map