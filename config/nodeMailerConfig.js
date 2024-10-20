import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  host:'smtp.gmail.com',
  port:465,
  secure:true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send OTP
const sendOTP = async (email, otp) => {
  const otpmail = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:465,
    secure:true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailData = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Your One Time Password for verification!',
    text: `Your one time password is ${otp}`,
  };

  try {
    await otpmail.sendMail(mailData);
    console.log('OTP sent successfully');
    console.log(mailData);
  } catch (error) {
    console.error(error);
    throw new Error('Error sending OTP email');
  }
};

export { transporter, sendOTP };
