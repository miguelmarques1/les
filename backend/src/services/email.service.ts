import * as sgMail from '@sendgrid/mail';

export interface EmailServiceInterface {
  send(email: string, message: string): Promise<void>;
}

export class EmailService implements EmailServiceInterface {
  private senderEmail: string;
  private senderName: string;

  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

    this.senderEmail = process.env.SENDGRID_SENDER_EMAIL!;
    this.senderName = process.env.SENDGRID_SENDER_NAME || 'No Reply';
  }

  public async send(to: string, message: string): Promise<void> {
    const msg = {
      to,
      from: {
        email: this.senderEmail,
        name: this.senderName,
      },
      subject: 'Mensagem da Livraria XYZ',
      html: message,
    };

    await sgMail.send(msg);
  }
}
