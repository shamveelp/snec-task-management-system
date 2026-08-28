import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Standard gmail setup
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });
  }

  async sendOtpEmail(to: string, otp: string): Promise<boolean> {
    try {
      this.logger.log(`Generated OTP: ${otp} for email: ${to}`);
      
      await this.transporter.sendMail({
        from: `"SNEC Task Management" <${process.env.APP_EMAIL}>`,
        to,
        subject: 'Your Registration OTP',
        text: `Your OTP for registration is: ${otp}`,
        html: `<p>Your OTP for registration is: <strong>${otp}</strong></p>`,
      });
      
      this.logger.log(`OTP Email successfully sent to ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${to}`, error);
      return false;
    }
  }
  async sendEmail({ to, subject, html }: { to: string; subject: string; html: string }): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: `"SNEC Task Management" <${process.env.APP_EMAIL}>`,
        to,
        subject,
        html,
      });
      this.logger.log(`Email successfully sent to ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error);
      return false;
    }
  }
}
