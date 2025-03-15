import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export const sendVerificationCodeViaSMS = async (phone, code) => {
    try {
        const message = await client.messages.create({
            body: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
            from: twilioPhoneNumber,
            to: phone,
        });
        console.log("SMS sent:", message.sid);
    } catch (err) {
        console.error("Error sending SMS:", err);
        throw err;
    }
};