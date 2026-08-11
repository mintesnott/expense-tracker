import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: Number(process.env.EMAIL_PORT || 465),
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Expense Tracker App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    };

    return await transporter.sendMail(mailOptions);
};

export default sendEmail;