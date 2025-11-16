export interface EmailService {
  sendConfirmationEmail(email: string, confirmationToken: string): Promise<void>;
  sendPasswordResetEmail(email: string, resetToken: string): Promise<void>;
  sendNotificationEmail(email: string, subject: string, message: string): Promise<void>;
}
