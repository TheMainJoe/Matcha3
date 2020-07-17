let nodemailer = require("nodemailer");

module.exports = {
  emailRegistrationMailer: (mail, username, link) => {
    var message =
      `
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body>
        <p>Hello ` +
      username +
      `,</p>
        <br>
        <p>By registering on Matcha, you are one step closer to finding love.</p>
        <p>Only one more step left to finding the one.</p>
        <p>Please make sure to validate the following link: <a href="` +
      link +
      `">Click here</a></p>
        <br>
        <p>Your potential love awaits on Matcha.</p>
      </body>
    </html>`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
          user: 'matcha2021@gmail.com',
          pass: 'Matcha@2020!'
      }
      });
  
      const mailOptions = {
      from: 'matcha2021@gmail.com', 
      to: mail,
      subject: 'Matcha - Welcome to Matcha',
      html: message
      };
  
      transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          console.log(error);
      } else {
          console.log('Email sent: ' + info.response);
      }
      });
  },

  forgotPasswordMailer: (mail, username, link) => {
    var message =
      `
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body>
        <p>Hello ` +
      username +
      `,</p>
        <br>
        <p>We have received your password reset request on Matcha.</p>
        <p>To reset your password please visit the following link: <a href="` +
      link +
      `">Click here</a></p>
        <br>
        <p>Your Matcha awaits.</p>
      </body>
    </html>`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
          user: 'matcha2021@gmail.com',
          pass: 'Matcha@2020!'
      }
      });
  
      const mailOptions = {
      from: 'matcha2021@gmail.com', 
      to: mail,
      subject: 'Matcha - Reset Password',
      html: message
      };
  
      transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          console.log(error);
      } else {
          console.log('Email sent: ' + info.response);
      }
      });
  }
};
