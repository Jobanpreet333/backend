
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, html) => {
 const msg = {
  to: 'test@example.com',
  from: 'joban43005@gmail.com', // ✅ hardcoded match
  subject: 'Test Email',
  html: '<h1>Hello from SendGrid</h1>'
};

  console.log("Sending from:", process.env.FROM_EMAIL);

  try {
    await sgMail.send(msg);
    console.log('✅ Email sent to:', to);
  } catch (error) {
    console.error('❌ Error sending email:', error.response?.body?.errors || error.message);
  }
};

module.exports = sendEmail;
