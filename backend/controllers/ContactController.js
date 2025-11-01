 
 
import ContactMessage from '../models/Contact.js';
import nodemailer from 'nodemailer';

// Get all contact messages
// export const getAllContactMessages = async (req, res) => {
//   try {
//     const messages = await ContactMessage.find().sort({ createdAt: -1 });
//     res.json({ success: true, count: messages.length, data: messages });
//   } catch (error) {
//     console.error('Error fetching contact messages:', error);
//     res.status(500).json({ success: false, error: 'Failed to fetch contact messages.' });
//   }
// };

// // Admin reply to a contact message
// export const replyContactMessage = async (req, res) => {
//   const { id } = req.params;
//   const { reply } = req.body;
//   if (!reply) {
//     return res.status(400).json({ success: false, error: 'Reply content is required.' });
//   }
//   try {
//     const message = await ContactMessage.findById(id);
//     if (!message) {
//       return res.status(404).json({ success: false, error: 'Message not found.' });
//     }
//     // Send reply email to the user
//     await sendEmail({
//       userEmail: process.env.EMAIL_USER, // admin email
//       email: message.email, // user email
//       subject: `Re: ${message.subject}`,
//       html: `<p>${reply}</p>`
//     });
//     message.status = 'replied';
//     message.reply = reply;
//     await message.save();
//     res.json({ success: true, message: 'Reply sent and status updated.', data: message });
//   } catch (error) {
//     console.error('Reply error:', error);
//     res.status(500).json({ success: false, error: 'Failed to reply to message.' });
//   }
// };

// Submit contact form
export const submitContactForm = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }
//  console.log(email)
  try {
  // //   // Optionally, send an email (configure your SMTP credentials)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: email,
      to: process.env.CONTACT_EMAIL,
      // subject: `Contact Form Submission from ${name} <${email}>`,
      subject: subject,
      text: message,
      replyTo: email, 
    });
    res.json({ success: true, message: 'Your message has been sent!' });
      //   // Save to database
    const contactMsg = new ContactMessage({ name, email, phone, subject, message });
    await contactMsg.save();
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ success: false, error: 'Failed to send message. Please try again later.' });
  } 
};

// // Delete a contact message
// export const deleteContactMessage = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const message = await ContactMessage.findByIdAndDelete(id);
//     if (!message) {
//       return res.status(404).json({ success: false, error: 'Message not found.' });
//     }
//     res.json({ success: true, message: 'Message deleted successfully.' });
//   } catch (error) {
//     console.error('Delete error:', error);
//     res.status(500).json({ success: false, error: 'Failed to delete message.' });
//   }
// }