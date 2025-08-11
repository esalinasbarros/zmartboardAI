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
exports.UpdateTimeEntryDto = exports.CreateTimeEntryDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CreateTimeEntryDto {
    hours;
    description;
    date;
}
exports.CreateTimeEntryDto = CreateTimeEntryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of hours worked on the task',
        example: 2.5,
        minimum: 0.1,
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Hours must be a valid number' }),
    (0, class_validator_1.Min)(0.1, { message: 'Hours must be at least 0.1' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateTimeEntryDto.prototype, "hours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Description of the work performed',
        example: 'Implemented user authentication feature',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTimeEntryDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date when the work was performed (ISO string)',
        example: '2024-01-15T10:30:00.000Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTimeEntryDto.prototype, "date", void 0);
class UpdateTimeEntryDto {
    hours;
    description;
    date;
}
exports.UpdateTimeEntryDto = UpdateTimeEntryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of hours worked on the task',
        example: 3.0,
        minimum: 0.1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Hours must be a valid number' }),
    (0, class_validator_1.Min)(0.1, { message: 'Hours must be at least 0.1' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateTimeEntryDto.prototype, "hours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Description of the work performed',
        example: 'Updated user authentication feature',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTimeEntryDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date when the work was performed (ISO string)',
        example: '2024-01-15T14:30:00.000Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateTimeEntryDto.prototype, "date", void 0);
//# sourceMappingURL=time-entry.dto.js.map