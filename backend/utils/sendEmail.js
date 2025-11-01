import nodemailer from 'nodemailer'
import { SMTP_EMAIL, SMTP_PASSWORD } from '../config/config.js';
// import { SMTP_EMAIL, SMTP_PASSWORD } from '../config/config';
 

const sendEmail = async (options) => {
  console.log('send mail.')
  console.log(options)
 console.log(SMTP_EMAIL)
 console.log(SMTP_PASSWORD)
//   const transporter = nodemailer.createTransport({
//     service:'Gmail',
//     auth: {
//       user: SMTP_EMAIL,
//       pass: SMTP_PASSWORD,
//     },
//   });
// // console.log(options)
//   const message = {
//     from: options.userEmail,
//     to: options.email,
//     replyTo:options.userEmail,
//     subject: options.subject,
//     html: options.html,
//   };

//   const info = await transporter.sendMail(message);

//   console.log('Message sent: %s', info.messageId);
};



const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <p>You requested a password reset for your account.</p>
      <p>Click this link to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send password reset email');
  }
};
export default  sendEmail;