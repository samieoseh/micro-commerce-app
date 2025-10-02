import { Resend } from "resend";
import { ApiError } from "../utils/api-error";

interface SendOptions {
    from: string,
    to: string[];
    subject: string;
    html: string;
}

class MailerService {
  private resend: Resend;

  constructor() {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not defined in environment variables");
    }

    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendMail(sendOptions: SendOptions) {
    const { data, error } = await this.resend.emails.send(sendOptions);

    if (error) {
      console.error("Resend error:", error);
      throw new ApiError(400, error.message); 
    }

    console.log("Email sent:", data);
    return data;
  }
}

const mailerService = new MailerService()
export  {mailerService, MailerService}