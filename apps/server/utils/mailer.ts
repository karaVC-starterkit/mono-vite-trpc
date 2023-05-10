//@ts-ignore
import nodemailer from "nodemailer";
import { IMailSendParams } from "./types";

const MAIL_SETTINGS = {
  from: {
    address: "kara.kaan1995@gmail.com",
    name: "Kaan's kit",
  },
};

export const sendMail = async (params: IMailSendParams) => {
  const { data, subject, to, attachments } = params;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.NODE_ENV === "production" ? true : false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailContent = {
    ...MAIL_SETTINGS,
    to,
    subject,
    html: data.content,
    attachments,
  };

  try {
    await transporter.sendMail(mailContent);
  } catch (e) {
    console.error(e);
  }
};

export const sendEmailVerification = async (email: string, code: string) => {
  return await sendMail({
    to: email,
    subject: "Verify you account.",
    data: {
      content: `Your verification code is ${code}`,
    },
  });
};
