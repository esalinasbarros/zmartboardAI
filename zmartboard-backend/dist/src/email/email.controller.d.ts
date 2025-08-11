import { EmailService } from './email.service';
import { SendVerificationDto, VerifyCodeDto } from './dto/send-verification.dto';
export declare class EmailController {
    private readonly emailService;
    constructor(emailService: EmailService);
    sendVerification(sendVerificationDto: SendVerificationDto): Promise<{
        message: string;
        success: boolean;
    }>;
    verifyCode(verifyCodeDto: VerifyCodeDto): Promise<{
        message: string;
        success: boolean;
        userId: string | undefined;
    }>;
    resendVerification(sendVerificationDto: SendVerificationDto): Promise<{
        message: string;
        success: boolean;
    }>;
    sendPasswordReset(email: string): Promise<{
        message: string;
        success: boolean;
    }>;
    verifyPasswordReset(email: string, code: string): Promise<{
        message: string;
        success: boolean;
        userId: string | undefined;
    }>;
    sendEmailChange(newEmail: string, userId: string): Promise<{
        message: string;
        success: boolean;
    }>;
    verifyEmailChange(newEmail: string, code: string, userId: string): Promise<{
        message: string;
        success: boolean;
        userId: string | undefined;
    }>;
}
