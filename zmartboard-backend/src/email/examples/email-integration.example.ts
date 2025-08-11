// /**
//  * Email Service Integration Examples
//  * 
//  * This file demonstrates how to integrate the email verification service
//  * with your authentication and user management flows.
//  */

// import { Injectable } from '@nestjs/common';
// import { EmailService } from '../email.service';
// import { AuthService } from '../../auth/auth.service';
// import { UsersService } from '../../users/users.service';
// import { VerificationType } from '../../../generated/prisma';

// @Injectable()
// export class EmailIntegrationExamples {
//   constructor(
//     private readonly emailService: EmailService,
//     private readonly authService: AuthService,
//     private readonly usersService: UsersService,
//   ) {}

//   /**
//    * Example 1: Enhanced User Registration with Email Verification
//    */
//   async registerUserWithEmailVerification(registerDto: any) {
//     try {
//       // 1. Register the user (but don't mark as verified yet)
//       const user = await this.authService.register({
//         ...registerDto,
//         // User starts as unverified
//       });

//       // 2. Send verification email
//       const emailResult = await this.emailService.sendVerificationEmail(
//         user.email,
//         VerificationType.EMAIL_VERIFICATION,
//         user.id,
//       );

//       if (!emailResult.success) {
//         // Handle email sending failure
//         // You might want to delete the user or mark for retry
//         throw new Error('Failed to send verification email');
//       }

//       return {
//         message: 'Registration successful. Please check your email for verification code.',
//         user: {
//           id: user.id,
//           email: user.email,
//           emailVerified: false,
//         },
//         emailSent: emailResult.success,
//       };
//     } catch (error) {
//       throw error;
//     }
//   }

//   /**
//    * Example 2: Complete Email Verification Process
//    */
//   async completeEmailVerification(email: string, code: string) {
//     try {
//       // Verify the code
//       const result = await this.emailService.verifyCode(
//         email,
//         code,
//         VerificationType.EMAIL_VERIFICATION,
//       );

//       if (!result.success) {
//         return {
//           success: false,
//           message: result.message,
//         };
//       }

//       // Get the updated user (emailVerified should now be true)
//       const user = await this.usersService.findById(result.userId!);

//       return {
//         success: true,
//         message: 'Email verified successfully',
//         user: {
//           id: user?.id,
//           email: user?.email,
//           emailVerified: true,
//         },
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: 'Verification failed',
//       };
//     }
//   }

//   /**
//    * Example 3: Password Reset Flow
//    */
//   async initiatePasswordReset(email: string) {
//     try {
//       // Check if user exists (optional - for security, you might skip this)
//       const user = await this.usersService.findByEmail(email);
      
//       if (!user) {
//         // For security, don't reveal if email exists
//         return {
//           success: true,
//           message: 'If the email exists, a reset code has been sent.',
//         };
//       }

//       // Send password reset email
//       const result = await this.emailService.sendVerificationEmail(
//         email,
//         VerificationType.PASSWORD_RESET,
//         user.id,
//       );

//       return {
//         success: true,
//         message: 'If the email exists, a reset code has been sent.',
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: 'Failed to process password reset request',
//       };
//     }
//   }

//   /**
//    * Example 4: Complete Password Reset
//    */
//   async completePasswordReset(
//     email: string,
//     code: string,
//     newPassword: string,
//   ) {
//     try {
//       // Verify the reset code
//       const verificationResult = await this.emailService.verifyCode(
//         email,
//         code,
//         VerificationType.PASSWORD_RESET,
//       );

//       if (!verificationResult.success) {
//         return {
//           success: false,
//           message: verificationResult.message,
//         };
//       }

//       // Update user password
//       const user = await this.usersService.update(verificationResult.userId!, {
//         password: newPassword, // This should be hashed in the service
//       });

//       return {
//         success: true,
//         message: 'Password reset successfully',
//         user: {
//           id: user.id,
//           email: user.email,
//         },
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: 'Failed to reset password',
//       };
//     }
//   }

//   /**
//    * Example 5: Email Change Flow
//    */
//   async initiateEmailChange(
//     userId: string,
//     currentEmail: string,
//     newEmail: string,
//   ) {
//     try {
//       // Check if new email is already in use
//       const existingUser = await this.usersService.findByEmail(newEmail);
//       if (existingUser) {
//         return {
//           success: false,
//           message: 'Email address is already in use',
//         };
//       }

//       // Send verification to new email
//       const result = await this.emailService.sendVerificationEmail(
//         newEmail,
//         VerificationType.EMAIL_CHANGE,
//         userId,
//       );

//       if (!result.success) {
//         return {
//           success: false,
//           message: 'Failed to send verification email',
//         };
//       }

//       return {
//         success: true,
//         message: 'Verification email sent to new address',
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: 'Failed to initiate email change',
//       };
//     }
//   }

//   /**
//    * Example 6: Complete Email Change
//    */
//   async completeEmailChange(
//     userId: string,
//     newEmail: string,
//     code: string,
//   ) {
//     try {
//       // Verify the code
//       const verificationResult = await this.emailService.verifyCode(
//         newEmail,
//         code,
//         VerificationType.EMAIL_CHANGE,
//       );

//       if (!verificationResult.success) {
//         return {
//           success: false,
//           message: verificationResult.message,
//         };
//       }

//       // Update user email
//       const user = await this.usersService.update(userId, {
//         email: newEmail,
//         emailVerified: true, // New email is verified
//       });

//       return {
//         success: true,
//         message: 'Email updated successfully',
//         user: {
//           id: user.id,
//           email: user.email,
//           emailVerified: true,
//         },
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: 'Failed to update email',
//       };
//     }
//   }

//   /**
//    * Example 7: Resend Verification Email
//    */
//   async resendVerificationEmail(
//     email: string,
//     type: VerificationType,
//     userId?: string,
//   ) {
//     try {
//       // Optional: Add rate limiting here
//       // Check if user has requested too many codes recently

//       const result = await this.emailService.sendVerificationEmail(
//         email,
//         type,
//         userId,
//       );

//       return {
//         success: result.success,
//         message: result.success
//           ? 'Verification email resent successfully'
//           : 'Failed to resend verification email',
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: 'Failed to resend verification email',
//       };
//     }
//   }

//   /**
//    * Example 8: Check Email Verification Status
//    */
//   async checkEmailVerificationStatus(userId: string) {
//     try {
//       const user = await this.usersService.findById(userId);
      
//       if (!user) {
//         return {
//           success: false,
//           message: 'User not found',
//         };
//       }

//       return {
//         success: true,
//         emailVerified: user.emailVerified,
//         email: user.email,
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: 'Failed to check verification status',
//       };
//     }
//   }

//   /**
//    * Example 9: Cleanup and Maintenance
//    */
//   async performMaintenance() {
//     try {
//       // Clean up expired verification codes
//       await this.emailService.cleanupExpiredCodes();
      
//       // You could add more maintenance tasks here:
//       // - Clean up unverified users older than X days
//       // - Generate usage reports
//       // - Check email delivery rates
      
//       return {
//         success: true,
//         message: 'Maintenance completed successfully',
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: 'Maintenance failed',
//       };
//     }
//   }
// }

// /**
//  * Usage in Controllers:
//  * 
//  * @Controller('auth')
//  * export class AuthController {
//  *   constructor(
//  *     private readonly emailIntegration: EmailIntegrationExamples
//  *   ) {}
//  * 
//  *   @Post('register')
//  *   async register(@Body() registerDto: RegisterDto) {
//  *     return this.emailIntegration.registerUserWithEmailVerification(registerDto);
//  *   }
//  * 
//  *   @Post('verify-email')
//  *   async verifyEmail(@Body() { email, code }: { email: string; code: string }) {
//  *     return this.emailIntegration.completeEmailVerification(email, code);
//  *   }
//  * 
//  *   @Post('forgot-password')
//  *   async forgotPassword(@Body() { email }: { email: string }) {
//  *     return this.emailIntegration.initiatePasswordReset(email);
//  *   }
//  * 
//  *   @Post('reset-password')
//  *   async resetPassword(
//  *     @Body() { email, code, newPassword }: { email: string; code: string; newPassword: string }
//  *   ) {
//  *     return this.emailIntegration.completePasswordReset(email, code, newPassword);
//  *   }
//  * }
//  */