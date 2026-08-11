import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => {
    console.log("EMAIL: creating transporter");
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: Number(process.env.EMAIL_PORT || 587),
        secure: false,
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

    try {
        console.log("EMAIL: attempting to send email to:", to);

        const info = await transporter.sendMail(mailOptions);

        console.log("EMAIL: sent successfully:", info.messageId);

        return info;
    } catch (error) {
        console.error("EMAIL: SEND FAILED");
        console.error("EMAIL ERROR CODE:", error.code);
        console.error("EMAIL ERROR COMMAND:", error.command);
        console.error("EMAIL ERROR RESPONSE:", error.response);
        console.error("EMAIL ERROR MESSAGE:", error.message);

        throw error;
    }
};

export default sendEmail;