import {Transporter} from 'nodemailer';
import {EmailSendStatus} from './enum/status';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const sendMail = async (
    transporter: Transporter<SMTPTransport.SentMessageInfo>,
    addressTo: string,
    subject: string,
    text: string,
): Promise<EmailSendStatus> => {
  await transporter.sendMail(
      {
        from: process.env.EMAIL_USER,
        to: addressTo,
        subject,
        text,
      },
      (err, info) => {
        if (err) {
          console.error(err);
          return EmailSendStatus.FAILED;
        }
        console.log(`E-mail sent with response: ${info.response}`);
        return EmailSendStatus.SENT;
      },
  );

  return EmailSendStatus.FAILED;
};
