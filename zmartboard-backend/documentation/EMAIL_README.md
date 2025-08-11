# Email Service Documentation

This document describes the email verification service implementation for ZMart Board backend.

## Overview

The email service provides secure email verification functionality with the following features:

- **Email verification codes** for user registration
- **Password reset codes** for account recovery
- **Email change verification** for updating user email addresses
- **Configurable email provider** support
- **Development mode** with disabled email sending (codes logged to console)
- **Rate limiting** and security features

## Database Schema

The service uses the following database models:

### EmailVerification Model
```prisma
model EmailVerification {
  id        String   @id @default(cuid())
  email     String
  code      String
  type      VerificationType
  expiresAt DateTime
  verified  Boolean  @default(false)
  attempts  Int      @default(0)
  userId    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User? @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("email_verifications")
}
```

### VerificationType Enum
```prisma
enum VerificationType {
  EMAIL_VERIFICATION
  PASSWORD_RESET
  EMAIL_CHANGE
}
```

### User Model Updates
The User model has been updated with:
- `emailVerified: Boolean @default(false)` - tracks email verification status
- `emailVerifications: EmailVerification[]` - relation to verification records

## Configuration

### Environment Variables

Add these variables to your `.env` file:

```env
# Email Configuration
EMAIL_ENABLED=false                              # Enable/disable email sending
EMAIL_HOST="smtp.gmail.com"                      # SMTP host
EMAIL_PORT=587                                   # SMTP port
EMAIL_SECURE=false                               # Use TLS/SSL
EMAIL_USER="your-email@gmail.com"                # SMTP username
EMAIL_PASSWORD="your-app-password"               # SMTP password (use app password for Gmail)
EMAIL_FROM="ZMart Board <noreply@zmartboard.com>" # From address
```

### Development Mode

When `EMAIL_ENABLED=false` (default), the service operates in development mode:
- Verification codes are generated and stored in the database
- Instead of sending emails, codes are logged to the server console
- All verification endpoints work normally
- Perfect for development and testing

### Production Setup

1. Set `EMAIL_ENABLED=true`
2. Configure your SMTP provider credentials
3. For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833)
4. For other providers, use their SMTP settings

## API Endpoints

### Send Verification Email
```http
POST /email/send-verification
Content-Type: application/json

{
  "email": "user@example.com",
  "type": "EMAIL_VERIFICATION",
  "userId": "optional-user-id"
}
```

### Verify Code
```http
POST /email/verify-code
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456",
  "type": "EMAIL_VERIFICATION"
}
```

### Resend Verification
```http
POST /email/resend-verification
Content-Type: application/json

{
  "email": "user@example.com",
  "type": "EMAIL_VERIFICATION",
  "userId": "optional-user-id"
}
```

### Send Password Reset
```http
POST /email/send-password-reset
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Verify Password Reset
```http
POST /email/verify-password-reset
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456"
}
```

### Send Email Change (Protected)
```http
POST /email/send-email-change
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "newEmail": "newemail@example.com",
  "userId": "user-id"
}
```

### Verify Email Change (Protected)
```http
POST /email/verify-email-change
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "newEmail": "newemail@example.com",
  "code": "123456",
  "userId": "user-id"
}
```

## Security Features

### Code Generation
- 6-digit random codes (100000-999999)
- Cryptographically secure random generation
- 15-minute expiration time

### Rate Limiting
- Maximum 5 verification attempts per code
- Old codes are invalidated when new ones are generated
- Automatic cleanup of expired codes

### Data Protection
- Codes are stored securely in the database
- No sensitive information in logs (except development mode)
- Proper error handling without information leakage

## Integration Examples

### User Registration Flow
```typescript
// 1. Register user
const user = await authService.register(registerDto);

// 2. Send verification email
await emailService.sendVerificationEmail(
  user.email,
  VerificationType.EMAIL_VERIFICATION,
  user.id
);

// 3. User enters code from email
// 4. Verify code
const result = await emailService.verifyCode(
  user.email,
  code,
  VerificationType.EMAIL_VERIFICATION
);

if (result.success) {
  // User email is now verified
  // user.emailVerified is automatically set to true
}
```

### Password Reset Flow
```typescript
// 1. User requests password reset
await emailService.sendVerificationEmail(
  email,
  VerificationType.PASSWORD_RESET
);

// 2. User enters code from email
// 3. Verify code
const result = await emailService.verifyCode(
  email,
  code,
  VerificationType.PASSWORD_RESET
);

if (result.success) {
  // Allow user to set new password
  // Use result.userId to identify the user
}
```

## Email Templates

The service includes responsive HTML email templates with:
- Professional ZMart Board branding
- Clear verification code display
- Security instructions
- Mobile-friendly design

## Database Migration

To apply the database changes:

```bash
# Generate migration
npx prisma migrate dev --name add-email-verification

# Or reset database (development only)
npx prisma migrate reset
```

## Maintenance

### Cleanup Expired Codes
The service includes a cleanup method for expired verification codes:

```typescript
// Call periodically (e.g., via cron job)
await emailService.cleanupExpiredCodes();
```

### Monitoring
Monitor these metrics in production:
- Email delivery success rate
- Verification code usage
- Failed verification attempts
- Expired code cleanup frequency

## Troubleshooting

### Common Issues

1. **Emails not sending in development**
   - Check that `EMAIL_ENABLED=false` (expected behavior)
   - Look for verification codes in server logs

2. **SMTP authentication errors**
   - Verify SMTP credentials
   - For Gmail, ensure 2FA is enabled and use App Password
   - Check firewall/network restrictions

3. **Verification codes not working**
   - Check code expiration (15 minutes)
   - Verify attempt limits (max 5 attempts)
   - Ensure email and type match exactly

### Logs
The service logs important events:
- Email sending attempts
- Verification code generation (development mode)
- SMTP errors
- Code verification attempts

## Future Enhancements

- [ ] Email template customization
- [ ] Multiple email provider support
- [ ] Advanced rate limiting
- [ ] Email delivery tracking
- [ ] Internationalization support
- [ ] SMS verification option
- [ ] Email queue for high volume

## Security Considerations

1. **Never log verification codes in production**
2. **Use strong SMTP credentials**
3. **Implement proper rate limiting**
4. **Monitor for abuse patterns**
5. **Regular security audits**
6. **Keep dependencies updated**

For questions or issues, please refer to the main project documentation or create an issue in the repository.