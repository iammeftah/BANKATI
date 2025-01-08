import axios from 'axios';

const EMAIL_URL = process.env.EMAIL_URL || 'http://localhost:8093';


export const emailService = {
    sendEmail: async (to: string, subject: string, text: string) => {
        try {
            const response = await axios.get(`${EMAIL_URL}/send-email`, {
                params: { to, subject, text }
            });
            return response.data;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
};
