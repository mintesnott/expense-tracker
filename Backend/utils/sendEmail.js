import dotenv from 'dotenv';
import { Resend } from "resend";


dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
    try {
        
        const { data, error } = await resend.emails.send({
            from: "Expense Tracker <onboarding@resend.dev>",
            to: [to],
            subject,
            html,
        });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export default sendEmail;


