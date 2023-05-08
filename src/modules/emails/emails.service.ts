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

  async sendConfirmationLink(to: string, url: string) {
    const email = templates.registerEmail(
      to,
      process.env.SENDGRID_FROM_EMAIL,
      url,
    );

    await this.send(email);
  }

  async sendGeneralEmail(
    to: string,
    emailContent: string,
    emailDescription?: string,
  ) {
    const email = templates.generalEmail(
      to,
      process.env.SENDGRID_FROM_EMAIL,
      emailContent,
      emailDescription,
    );

    await this.send(email);
  }
}
