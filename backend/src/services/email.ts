import nodemailer from 'nodemailer';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class EmailService {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;

  constructor(config: EmailConfig, fromEmail: string) {
    this.transporter = nodemailer.createTransport(config);
    this.fromEmail = fromEmail;
  }

  async sendOrderConfirmation(
    userEmail: string,
    orderDetails: {
      orderId: string;
      planName: string;
      amount: number;
      currency: string;
    }
  ) {
    const mailOptions = {
      from: this.fromEmail,
      to: userEmail,
      subject: 'Order Confirmation - Ibn Al Arab Restaurant',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d97706;">Order Confirmation</h2>
          
          <p>Thank you for your order with Ibn Al Arab Restaurant!</p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
            <p><strong>Plan:</strong> ${orderDetails.planName}</p>
            <p><strong>Amount:</strong> ${orderDetails.amount} ${orderDetails.currency}</p>
          </div>
          
          <p>Your payment is currently being processed. You will receive another email once your payment is confirmed.</p>
          
          <p>Thank you for choosing Ibn Al Arab Restaurant!</p>
          
          <hr style="margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            Ibn Al Arab Restaurant<br>
            Your Partner to a Healthy Academia
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Order confirmation email sent to ${userEmail}`);
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      throw error;
    }
  }

  async sendPaymentApproval(
    userEmail: string,
    orderDetails: {
      orderId: string;
      planName: string;
      amount: number;
      currency: string;
    }
  ) {
    const mailOptions = {
      from: this.fromEmail,
      to: userEmail,
      subject: 'Payment Approved - Ibn Al Arab Restaurant',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Payment Approved!</h2>
          
          <p>Great news! Your payment has been approved and your subscription is now active.</p>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
            <h3>Subscription Details:</h3>
            <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
            <p><strong>Plan:</strong> ${orderDetails.planName}</p>
            <p><strong>Amount:</strong> ${orderDetails.amount} ${orderDetails.currency}</p>
            <p><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">ACTIVE</span></p>
          </div>
          
          <p>You can now access your meal plan and start enjoying healthy, delicious meals!</p>
          
          <p>Thank you for choosing Ibn Al Arab Restaurant!</p>
          
          <hr style="margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            Ibn Al Arab Restaurant<br>
            Your Partner to a Healthy Academia
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Payment approval email sent to ${userEmail}`);
    } catch (error) {
      console.error('Failed to send payment approval email:', error);
      throw error;
    }
  }

  async sendPaymentRejection(
    userEmail: string,
    orderDetails: {
      orderId: string;
      planName: string;
      amount: number;
      currency: string;
      reason?: string;
    }
  ) {
    const mailOptions = {
      from: this.fromEmail,
      to: userEmail,
      subject: 'Payment Update - Ibn Al Arab Restaurant',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Payment Update Required</h2>
          
          <p>We need to update you about your recent payment submission.</p>
          
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
            <p><strong>Plan:</strong> ${orderDetails.planName}</p>
            <p><strong>Amount:</strong> ${orderDetails.amount} ${orderDetails.currency}</p>
            ${orderDetails.reason ? `<p><strong>Note:</strong> ${orderDetails.reason}</p>` : ''}
          </div>
          
          <p>Please contact our support team or submit a new payment with the correct details.</p>
          
          <p>We apologize for any inconvenience and appreciate your understanding.</p>
          
          <hr style="margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            Ibn Al Arab Restaurant<br>
            Your Partner to a Healthy Academia
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Payment rejection email sent to ${userEmail}`);
    } catch (error) {
      console.error('Failed to send payment rejection email:', error);
      throw error;
    }
  }
}

// Factory function to create email service from environment variables
export function createEmailService(): EmailService | null {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
    FROM_EMAIL
  } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !FROM_EMAIL) {
    console.warn('Email service not configured - missing SMTP environment variables');
    return null;
  }

  const config: EmailConfig = {
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: SMTP_SECURE === 'true',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  };

  return new EmailService(config, FROM_EMAIL);
}