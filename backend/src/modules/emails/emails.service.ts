import { Injectable } from '@nestjs/common';
import { templates } from './template';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor() {
    SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async send(email: SendGrid.MailDataRequired) {
    if (process.env.SENDGRID_API_KEY) {
      await SendGrid.send(email);
    } else if (process.env.NODE_ENV === 'production')
      throw new Error('process.env.SENDGRID_API_KEY is undefined!');
    // tslint:disable-next-line:no-console
    else console.warn('process.env.SENDGRID_API_KEY is undefined!');
  }

  async sendContactForm(clientEmail: string, description: string, to: string) {
    const email = templates.registerCompanyEmail(
      to,
      process.env.SENDGRID_FROM_EMAIL,
      description,
      clientEmail,
    );

    await this.send(email);
  }
}
