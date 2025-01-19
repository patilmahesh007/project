import nodemailer from 'nodemailer';

const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', 
      port: 587,
      secure: false, 
      auth: {
        user: process.env.SMTP_EMAIL, 
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Your App Name" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: subject,
      text: message, 
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent.');
  }
};

export default sendEmail;
