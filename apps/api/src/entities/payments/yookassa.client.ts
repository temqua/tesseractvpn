import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import env from '../../env';

@Injectable()
export class YookassaClient {
  async checkout(amount: number, paymentId: string, test = true) {
    const username = test ? env.YOOKASSA_TEST_USERNAME : env.YOOKASSA_USERNAME;
    const password = test ? env.YOOKASSA_TEST_PASSWORD : env.YOOKASSA_PASSWORD;
    const encodedCredentials = btoa(`${username}:${password}`);
    const body = {
      amount: {
        value: amount,
        currency: 'RUB',
      },
      confirmation: {
        type: 'redirect',
        return_url: 'https://t.me/tesseract_users_bot',
      },
      capture: true,
      description: `Платёж ${paymentId}`,
      metadata: {
        id: paymentId,
      },
    };
    return await fetch('https://api.yookassa.ru/v3/payments', {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        'Content-Type': 'application/json',
        'Idempotence-Key': randomUUID(),
      },
      body: JSON.stringify(body),
    });
  }
}
