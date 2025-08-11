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
exports.VerifyCodeDto = exports.SendVerificationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class SendVerificationDto {
    email;
    type;
    userId;
}
exports.SendVerificationDto = SendVerificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email address to send verification code to',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SendVerificationDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of verification',
        enum: client_1.VerificationType,
        example: client_1.VerificationType.EMAIL_VERIFICATION,
    }),
    (0, class_validator_1.IsEnum)(client_1.VerificationType),
    __metadata("design:type", String)
], SendVerificationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User ID (optional, for specific verification types)',
        example: 'clx1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendVerificationDto.prototype, "userId", void 0);
class VerifyCodeDto {
    email;
    code;
    type;
}
exports.VerifyCodeDto = VerifyCodeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email address',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], VerifyCodeDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Verification code',
        example: '123456',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyCodeDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of verification',
        enum: client_1.VerificationType,
        example: client_1.VerificationType.EMAIL_VERIFICATION,
    }),
    (0, class_validator_1.IsEnum)(client_1.VerificationType),
    __metadata("design:type", String)
], VerifyCodeDto.prototype, "type", void 0);
//# sourceMappingURL=send-verification.dto.js.map