const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const pug = require('pug');

const { DEV_MAIL_USER, DEV_MAIL_PORT, DEV_MAIL_PASS, DEV_MAIL_HOST } = process.env;

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.fullName.split(' ')[0];
    this.url = url;
    this.from = `Cedar Daniel <${process.env.DEV_EMAIL_USER}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV !== 'production') { 
      // Sendgrid
      return nodemailer.createTransport({
        host: DEV_MAIL_HOST,
        port: DEV_MAIL_PORT,
        auth: {
          user: DEV_MAIL_USER,
          pass: DEV_MAIL_PASS,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the 3Green Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};
