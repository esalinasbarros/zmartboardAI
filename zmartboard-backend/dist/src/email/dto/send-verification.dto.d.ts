import { VerificationType } from '@prisma/client';
export declare class SendVerificationDto {
    email: string;
    type: VerificationType;
    userId?: string;
}
export declare class VerifyCodeDto {
    email: string;
    code: string;
    type: VerificationType;
}
