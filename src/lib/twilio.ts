import { env } from "env/server.mjs";
import twilio from "twilio";

const accountSid = env.TWILIO_ACCOUNT_SID;
const authToken = env.TWILIO_AUTH_TOKEN;
const serviceSid = env.TWILIO_SERVICE_SID;
const client = twilio(accountSid, authToken);

export const twilioCreateVerification = async ({ phoneNumber }: { phoneNumber: string }) => {
  try {
    await client.verify.v2
      .services(serviceSid)
      .verifications.create({ channel: "sms", to: phoneNumber });
  } catch (err) {
    console.error("ERROR in creating verification message!");
  }
};

export const twilioCheckVerification = async ({
  phoneNumber,
  verificationCode,
}: {
  phoneNumber: string;
  verificationCode: string;
}) => {
  try {
    await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: phoneNumber, code: verificationCode });
  } catch (err) {
    console.error("ERROR in creating verification message!");
  }
};
