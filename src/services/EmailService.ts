import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export enum EmailSendStatus {
  SENT,
  FAILED,
}

export class EmailService {
  private static instance: EmailService;

  private readonly transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }

    return EmailService.instance;
  }

  public async sendMail(
    addressTo: string,
    subject: string,
    text: string
  ): Promise<EmailSendStatus> {
    await this.transporter.sendMail(
      {
        from: process.env.EMAIL_USER,
        to: addressTo,
        subject,
        text,
      },
      (err, _) => {
        if (err) {
          console.error(err);
          return EmailSendStatus.FAILED;
        } else {
          console.log(
            `E-mail sent with status: ${EmailSendStatus[EmailSendStatus.SENT]}`
          );
          return EmailSendStatus.SENT;
        }
      }
    );
    return EmailSendStatus.FAILED;
  }
}
