import nodeMailer from 'nodemailer';

export const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        service: process.env.SMTP_SERVICES,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL, // e.g., 'Your App <yourapp@gmail.com>'
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOptions);
};
