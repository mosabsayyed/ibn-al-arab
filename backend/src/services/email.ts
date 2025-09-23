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

// Default Hostinger SMTP configuration
export const defaultEmailConfig: EmailConfig = {
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
};

export class EmailService {
  private transporter: nodemailer.Transporter;
  private fromEmail: string = process.env.FROM_EMAIL || 'feedback_ibnalarab@miles.click';

  constructor(config: EmailConfig = defaultEmailConfig) {
    this.transporter = nodemailer.createTransport(config);
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
      from: `Ibrahim <${this.fromEmail}>`,
      to: userEmail,
      subject: 'تأكيد الطلب - مطعم ابن العرب | Order Confirmation - Ibn Al Arab Restaurant',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white;">
          <!-- Header with Logo -->
          <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #dc2626;">
            <img src="https://ibnalarab.miles.click/LogoChef.png" alt="Ibn Al Arab" style="width: auto; height: 80px; max-width: 150px; margin-bottom: 10px;">
            <h2 style="color: #dc2626; margin: 0; font-size: 24px;">تأكيد الطلب</h2>
            <h2 style="color: #dc2626; margin: 5px 0 0 0; font-size: 20px;">Order Confirmation</h2>
          </div>
          
          <!-- Arabic Content -->
          <div style="padding: 20px; direction: rtl; text-align: right;">
            <p style="font-size: 16px; margin-bottom: 20px;">شكراً لك على طلبك من مطعم ابن العرب!</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #6b7280;">
              <h3 style="color: #374151; margin-top: 0;">تفاصيل الطلب:</h3>
              <p><strong>رقم الطلب:</strong> ${orderDetails.orderId}</p>
              <p><strong>الخطة:</strong> ${orderDetails.planName}</p>
              <p><strong>المبلغ:</strong> ${orderDetails.amount} ${orderDetails.currency}</p>
            </div>
            
            <p>يتم حالياً معالجة دفعتك. ستتلقى بريداً إلكترونياً آخر بمجرد تأكيد دفعتك.</p>
            <p>شكراً لك لاختيارك مطعم ابن العرب!</p>
          </div>
          
          <!-- English Content -->
          <div style="padding: 20px; direction: ltr; text-align: left; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 16px; margin-bottom: 20px;">Thank you for your order with Ibn Al Arab Restaurant!</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6b7280;">
              <h3 style="color: #374151; margin-top: 0;">Order Details:</h3>
              <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
              <p><strong>Plan:</strong> ${orderDetails.planName}</p>
              <p><strong>Amount:</strong> ${orderDetails.amount} ${orderDetails.currency}</p>
            </div>
            
            <p>Your payment is currently being processed. You will receive another email once your payment is confirmed.</p>
            <p>Thank you for choosing Ibn Al Arab Restaurant!</p>
          </div>
          
          <!-- Footer -->
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; text-align: center;">
            <p>مطعم ابن العرب | Ibn Al Arab Restaurant<br>
            شريكك نحو حياة أكاديمية صحية | Your Partner to a Healthy Academia<br>
            Email: feedback_ibnalarab@miles.click<br>
            هذه رسالة آلية، يرجى عدم الرد على هذا البريد الإلكتروني | This is an automated message, please do not reply to this email.</p>
          </div>
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
      from: `Ibrahim <${this.fromEmail}>`,
      to: userEmail,
      subject: 'تمت الموافقة على الدفع - مطعم ابن العرب | Payment Approved - Ibn Al Arab Restaurant',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white;">
          <!-- Header with Logo -->
          <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #dc2626;">
            <img src="https://ibnalarab.miles.click/LogoChef.png" alt="Ibn Al Arab" style="width: auto; height: 80px; max-width: 150px; margin-bottom: 10px;">
            <h2 style="color: #dc2626; margin: 0; font-size: 24px;">تمت الموافقة على الدفع</h2>
            <h2 style="color: #dc2626; margin: 5px 0 0 0; font-size: 20px;">Payment Approved</h2>
          </div>
          
          <!-- Arabic Content -->
          <div style="padding: 20px; direction: rtl; text-align: right;">
            <p style="font-size: 16px; margin-bottom: 20px;">أخبار رائعة! تمت الموافقة على دفعتك وأصبح اشتراكك نشطاً الآن.</p>
            
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #10b981;">
              <h3 style="color: #374151; margin-top: 0;">تفاصيل الاشتراك:</h3>
              <p><strong>رقم الطلب:</strong> ${orderDetails.orderId}</p>
              <p><strong>الخطة:</strong> ${orderDetails.planName}</p>
              <p><strong>المبلغ:</strong> ${orderDetails.amount} ${orderDetails.currency}</p>
              <p><strong>الحالة:</strong> <span style="color: #10b981; font-weight: bold;">نشط</span></p>
            </div>
            
            <p>يمكنك الآن الوصول إلى خطة وجباتك والبدء في الاستمتاع بوجبات صحية ولذيذة!</p>
            <p>شكراً لك لاختيارك مطعم ابن العرب!</p>
          </div>
          
          <!-- English Content -->
          <div style="padding: 20px; direction: ltr; text-align: left; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 16px; margin-bottom: 20px;">Great news! Your payment has been approved and your subscription is now active.</p>
            
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #374151; margin-top: 0;">Subscription Details:</h3>
              <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
              <p><strong>Plan:</strong> ${orderDetails.planName}</p>
              <p><strong>Amount:</strong> ${orderDetails.amount} ${orderDetails.currency}</p>
              <p><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">ACTIVE</span></p>
            </div>
            
            <p>You can now access your meal plan and start enjoying healthy, delicious meals!</p>
            <p>Thank you for choosing Ibn Al Arab Restaurant!</p>
          </div>
          
          <!-- Footer -->
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; text-align: center;">
            <p>مطعم ابن العرب | Ibn Al Arab Restaurant<br>
            شريكك نحو حياة أكاديمية صحية | Your Partner to a Healthy Academia<br>
            Email: feedback_ibnalarab@miles.click<br>
            هذه رسالة آلية، يرجى عدم الرد على هذا البريد الإلكتروني | This is an automated message, please do not reply to this email.</p>
          </div>
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
    },
    reason?: string
  ) {
    const mailOptions = {
      from: `Ibrahim <${this.fromEmail}>`,
      to: userEmail,
      subject: 'مطلوب تحديث الدفع - مطعم ابن العرب | Payment Update Required - Ibn Al Arab Restaurant',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white;">
          <!-- Header with Logo -->
          <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #dc2626;">
            <img src="https://ibnalarab.miles.click/LogoChef.png" alt="Ibn Al Arab" style="width: auto; height: 80px; max-width: 150px; margin-bottom: 10px;">
            <h2 style="color: #dc2626; margin: 0; font-size: 24px;">مطلوب تحديث الدفع</h2>
            <h2 style="color: #dc2626; margin: 5px 0 0 0; font-size: 20px;">Payment Update Required</h2>
          </div>
          
          <!-- Arabic Content -->
          <div style="padding: 20px; direction: rtl; text-align: right;">
            <p style="font-size: 16px; margin-bottom: 20px;">نحتاج إلى تحديثك حول إرسال دفعتك الأخيرة.</p>
            
            <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #dc2626;">
              <h3 style="color: #374151; margin-top: 0;">تفاصيل الطلب:</h3>
              <p><strong>رقم الطلب:</strong> ${orderDetails.orderId}</p>
              <p><strong>الخطة:</strong> ${orderDetails.planName}</p>
              <p><strong>المبلغ:</strong> ${orderDetails.amount} ${orderDetails.currency}</p>
              <p><strong>الحالة:</strong> <span style="color: #dc2626; font-weight: bold;">مطلوب مراجعة</span></p>
              ${reason ? `<p><strong>السبب:</strong> ${reason}</p>` : ''}
            </div>
            
            <p>يرجى الاتصال بفريق خدمة العملاء لدينا لحل هذه المسألة. يمكنك الوصول إلينا عبر feedback_ibnalarab@miles.click أو من خلال موقعنا الإلكتروني.</p>
            <p>نعتذر عن أي إزعاج ونتطلع إلى خدمتك قريباً.</p>
          </div>
          
          <!-- English Content -->
          <div style="padding: 20px; direction: ltr; text-align: left; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 16px; margin-bottom: 20px;">We need to update you about your recent payment submission.</p>
            
            <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <h3 style="color: #374151; margin-top: 0;">Order Details:</h3>
              <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
              <p><strong>Plan:</strong> ${orderDetails.planName}</p>
              <p><strong>Amount:</strong> ${orderDetails.amount} ${orderDetails.currency}</p>
              <p><strong>Status:</strong> <span style="color: #dc2626; font-weight: bold;">NEEDS REVIEW</span></p>
              ${reason ? `<p><strong>Note:</strong> ${reason}</p>` : ''}
            </div>
            
            <p>Please contact our customer service team to resolve this issue. You can reach us at feedback_ibnalarab@miles.click or through our website.</p>
            <p>We apologize for any inconvenience and look forward to serving you soon.</p>
          </div>
          
          <!-- Footer -->
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; text-align: center;">
            <p>مطعم ابن العرب | Ibn Al Arab Restaurant<br>
            شريكك نحو حياة أكاديمية صحية | Your Partner to a Healthy Academia<br>
            Email: feedback_ibnalarab@miles.click<br>
            هذه رسالة آلية، يرجى عدم الرد على هذا البريد الإلكتروني | This is an automated message, please do not reply to this email.</p>
          </div>
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

  return new EmailService(config);
}