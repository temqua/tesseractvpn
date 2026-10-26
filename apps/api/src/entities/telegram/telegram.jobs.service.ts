import { Injectable, Logger } from '@nestjs/common';
import env from '../../env';
import { SendMessageBody, SendMessageParams } from './telegram.definitions';
import { TelegramClient } from './telegram.client';

@Injectable()
export class TelegramJobsService {
  private readonly logger = new Logger(TelegramJobsService.name);
  private readonly client = new TelegramClient(env.JOBS_BOT_TOKEN);
  private readonly chatId = env.TG_NOTIFICATIONS_CHAT_ID;
  async sendMessage(
    text: string,
    params: SendMessageParams = {},
  ): Promise<void> {
    try {
      const sendMessageBody: SendMessageBody = {
        chat_id: this.chatId,
        text,
        ...params,
      };
      const response = await this.client.sendMessage(sendMessageBody);
      if (!response.ok) {
        this.logger.error(
          `Error while sending jobs telegram message ${text}: ${response.status} ${response.statusText}`,
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
      this.logger.error(`Failed to send jobs telegram message ${text}. ${err}`);
    }
  }
}
