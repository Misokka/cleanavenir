import nodemailer from 'nodemailer';
import type { EmailService } from '../../application/ports/services/EmailService';

export class NodemailerEmailService implements EmailService {
  private transporter: nodemailer.Transporter;
  private frontendUrl: string;
  private fromName: string;
  private fromEmail: string;

  constructor() {
    this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    this.fromName = process.env.MAIL_FROM_NAME || 'Clean Avenir';
    this.fromEmail = process.env.MAIL_FROM_EMAIL || 'noreply@cleanavenir.com';

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to,
        subject,
        html,
      });
      console.log(`[EMAIL] Sent to ${to}: ${subject}`);
    } catch (error) {
      console.error(`[EMAIL] Failed to send to ${to}:`, error);
      if (process.env.NODE_ENV === 'development') {
        console.log('[EMAIL FALLBACK] Email content:');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`HTML: ${html}`);
        console.log('---');
      }
      // Ne pas bloquer l'inscription en cas d'échec email
    }
  }

  async sendConfirmationEmail(email: string, confirmationToken: string): Promise<void> {
    const verificationLink = `${this.frontendUrl}/fr/auth/verify-email?token=${confirmationToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #083A31; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #3F6868; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Clean Avenir</h1>
          </div>
          <div class="content">
            <h2>Confirmez votre adresse email</h2>
            <p>Bienvenue chez Clean Avenir !</p>
            <p>Pour activer votre compte et accéder à tous nos services, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :</p>
            <p style="text-align: center;">
              <a href="${verificationLink}" class="button">Activer mon compte</a>
            </p>
            <p>Ou copiez ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 4px;">
              ${verificationLink}
            </p>
            <p><strong>Ce lien expire dans 24 heures.</strong></p>
            <p>Si vous n'avez pas créé de compte sur Clean Avenir, vous pouvez ignorer cet email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Clean Avenir. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Log du lien en dev pour faciliter les tests
    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 [DEV] Verification link:', verificationLink);
    }

    await this.sendEmail(email, 'Confirmez votre inscription à Clean Avenir', html);
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetLink = `${this.frontendUrl}/fr/auth/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #083A31; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #3F6868; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Clean Avenir</h1>
          </div>
          <div class="content">
            <h2>Réinitialisation de votre mot de passe</h2>
            <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
            <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
            <p style="text-align: center;">
              <a href="${resetLink}" class="button">Réinitialiser mon mot de passe</a>
            </p>
            <p>Ou copiez ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 4px;">
              ${resetLink}
            </p>
            <p><strong>Ce lien expire dans 1 heure.</strong></p>
            <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Clean Avenir. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, 'Réinitialisation de votre mot de passe Clean Avenir', html);
  }

  async sendNotificationEmail(email: string, subject: string, message: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #083A31; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Clean Avenir</h1>
          </div>
          <div class="content">
            <h2>${subject}</h2>
            <p>${message}</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Clean Avenir. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, subject, html);
  }
}
