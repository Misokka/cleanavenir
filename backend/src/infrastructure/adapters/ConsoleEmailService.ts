import type { EmailService } from '../../application/ports/services/EmailService';

/**
 * Mock Email Service pour le développement
 * Affiche les emails dans la console au lieu de les envoyer
 */
export class ConsoleEmailService implements EmailService {
  async sendConfirmationEmail(email: string, confirmationToken: string): Promise<void> {
    console.log('📧 [EMAIL] Confirmation Email');
    console.log(`To: ${email}`);
    console.log(`Subject: Confirmez votre inscription à CleanAvenir`);
    console.log(`Confirmation Link: http://localhost:3000/confirm?token=${confirmationToken}`);
    console.log('---');
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    console.log('📧 [EMAIL] Password Reset Email');
    console.log(`To: ${email}`);
    console.log(`Subject: Réinitialisation de votre mot de passe`);
    console.log(`Reset Link: http://localhost:3000/reset-password?token=${resetToken}`);
    console.log('---');
  }

  async sendNotificationEmail(email: string, subject: string, message: string): Promise<void> {
    console.log('📧 [EMAIL] Notification Email');
    console.log(`To: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log('---');
  }
}
