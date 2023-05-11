import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_HOST_PORT, 10),
  auth: {
    user: process.env.MAIL_CLIENT_ID,
    pass: process.env.MAIL_CLIENT_PASSWORD,
  },
});
