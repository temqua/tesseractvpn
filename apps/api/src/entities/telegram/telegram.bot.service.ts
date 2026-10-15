import { Injectable, Logger } from '@nestjs/common';
import env from '../../env';
import { TelegramClient } from './telegram.client';
import { SendMessageBody } from './telegram.definitions';

@Injectable()
export class TelegramBotService {
  private readonly logger = new Logger(TelegramBotService.name);
  private readonly client = new TelegramClient(env.BOT_TOKEN);
  private readonly chatId = env.ADMIN_TG_USER_ID;
  async send(text: string, body: Partial<SendMessageBody>): Promise<void> {
    // if (env.APP_ENV === 'local') {
    //   return;
    // }
    try {
      const sendMessageBody: SendMessageBody = {
        text,
        chat_id: this.chatId,
        ...body,
      };
      const response = await this.client.sendMessage(sendMessageBody);
      if (!response.ok) {
        this.logger.error(
          `Error while sending telegram message ${body.text}: ${response.status} ${response.statusText}`,
        );
        const isJson = response.headers
          .get('Content-Type')
          ?.includes('application/json');
        if (response.body && isJson) {
          const parsed = await response.text();
          this.logger.error(parsed);
        }
      }
    } catch (err) {
      this.logger.error(
        `Failed to send to telegram message ${body.text}. ${err}`,
      );
    }
  }
}
