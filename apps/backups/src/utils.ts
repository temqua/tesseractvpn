import type { Message } from 'node-telegram-bot-api';
import env from './env';

export const isAdmin = (msg: Message): boolean => {
	return msg?.from?.id === env.ADMIN_USER_ID;
};

export function splitStringByLength(str: string, chunkSize: number): string[] {
	const chunks: string[] = [];

	for (let i = 0; i < str.length; i += chunkSize) {
		chunks.push(str.slice(i, i + chunkSize));
	}

	return chunks;
}
