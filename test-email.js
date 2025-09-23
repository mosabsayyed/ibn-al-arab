import { EmailService, defaultEmailConfig } from './dist/backend/src/services/email.js';

async function testEmails() {
  console.log('Testing email service with Hostinger SMTP...');
  
  const emailService = new EmailService(defaultEmailConfig);
  const testEmail = 'mosab@miles.click';
  
  try {
    // Test 1: Order Confirmation Email
    console.log('\n1. Sending Order Confirmation Email...');
    await emailService.sendOrderConfirmation(testEmail, {
      orderId: 'TEST-ORD-' + Date.now(),
      planName: 'Flex Plan (High-protein for growth)',
      amount: 1100,
      currency: 'AED'
    });
    console.log('✅ Order confirmation email sent successfully!');
    
    // Test 2: Payment Approval Email
    console.log('\n2. Sending Payment Approval Email...');
    await emailService.sendPaymentApproval(testEmail, {
      orderId: 'TEST-ORD-' + Date.now(),
      planName: 'Focus Plan (Balanced clarity & maintenance)',
      amount: 640,
      currency: 'AED'
    });
    console.log('✅ Payment approval email sent successfully!');
    
    // Test 3: Payment Rejection Email
    console.log('\n3. Sending Payment Rejection Email...');
    await emailService.sendPaymentRejection(testEmail, {
      orderId: 'TEST-ORD-' + Date.now(),
      planName: 'Fuel Plan (Everyday energy)',
      amount: 550,
      currency: 'AED'
    }, 'Bank transfer verification needed');
    console.log('✅ Payment rejection email sent successfully!');
    
    console.log('\n🎉 All test emails sent successfully to mosab@miles.click!');
    console.log('Please check your inbox and spam folder.');
    
  } catch (error) {
    console.error('❌ Error sending emails:', error);
    
    if (error.code === 'EAUTH') {
      console.error('Authentication failed. Please check your SMTP credentials.');
    } else if (error.code === 'ECONNECTION') {
      console.error('Connection failed. Please check your SMTP host and port settings.');
    } else {
      console.error('Error details:', error.message);
    }
  }
}

testEmails();