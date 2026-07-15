import { Injectable, Logger } from '@nestjs/common';
import env from '../../env';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  private readonly chatId = env.JOBS_CHAT_ID;
  async send(text: string) {
    try {
      const body = JSON.stringify({
        chat_id: this.chatId,
        text,
      });
      const response = await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: body,
        },
      );
      if (!response.ok) {
        this.logger.error(
          `Error while sending telegram message ${text}: ${response.status} ${response.statusText}`,
        );
      }
    } catch (err) {
      this.logger.error(`Failed to send to telegram message ${text}. ${err}`);
    }
  }
}
