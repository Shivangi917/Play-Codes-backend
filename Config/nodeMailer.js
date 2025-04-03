import nodemailer from 'nodemailer';

import dotenv from 'dotenv';
dotenv.config();

const sender = {
    name: "Your App Name",
    email: process.env.EMAIL_USER,
};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const info = await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "Verify your email",
            html: `
                <h2>Email Verification</h2>
                <p>Your verification code is: <strong>${verificationToken}</strong></p>
                <p>Enter this code in the app to verify your email.</p>
            `,
        });

        console.log("Verification email sent:", info.messageId);
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Error sending verification email");
    }
};
