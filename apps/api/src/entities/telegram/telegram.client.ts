import { SendMessageBody } from './telegram.definitions';

export class TelegramClient {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async sendMessage(body: SendMessageBody) {
    return await fetch(
      `https://api.telegram.org/bot${this.token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    );
  }
}
