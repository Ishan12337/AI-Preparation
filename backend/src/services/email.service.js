const { model } = require("mongoose");
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
    }
});

transporter.verify((error, success) => {   
     if (error) {
        console.error("Email transporter verification failed:", error);
    } else {
        console.log("Email transporter is ready to send messages");

    }
});

const sendEmail = async (to, subject, text, html) => {
    try{
        const info = await transporter.sendMail({
            from:`AI Preparation <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        });
        console.log("Email sent successfully:", info.messageId);
        console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};



async function sendRegisterUserEmail(userEmail, name) {
    const subject = "🚀 Welcome to AI Preparation, " + name + "!";
    
    const text = `
Hi ${name},

Welcome to AI Preparation! We're thrilled to have you on board.

Explore courses, practice interviews, and boost your skills.

Visit: https://your-website.com

Best regards,
The AI Preparation Team
    `;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <div style="background-color: #4A90E2; color: white; padding: 15px; border-radius: 6px 6px 0 0; text-align: center;">
            <h1>Welcome to AI Preparation!</h1>
        </div>
        <div style="padding: 20px; color: #333;">
            <p>Hi <strong>${name}</strong>,</p>
            <p>We’re thrilled to have you on board! Start exploring courses, practice interviews, and level up your skills in tech.</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="https://your-website.com" 
                   style="background-color: #4A90E2; color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold;">
                   Get Started
                </a>
            </p>
            <p>Best regards,<br><strong>The AI Preparation Team</strong></p>
        </div>
        <div style="text-align: center; font-size: 12px; color: #777; padding-top: 10px;">
            Need help? Contact us at <a href="mailto:support@your-website.com">support@your-website.com</a>
        </div>
    </div>
    `;

    await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendRegisterUserEmail
}