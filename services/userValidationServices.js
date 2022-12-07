import nodemailer from 'nodemailer';

// Transport to send an verification email
let transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: true,
  tls: {
    rejectUnauthorized: true,
    minVersion: 'TLSv1.2'
  },
  auth: {
    user: "testemail9121@gmail.com",
    pass: 'tpizygcgppixhjtd'
  },
});

export default transporter;
