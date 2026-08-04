import { IServer } from '@/app/lib/api/servers/definitions';
import { IErrorBody } from '@/app/lib/definitions.global';
import z from 'zod';
export const ServerFormSchema = z.object({
	name: z.string(),
	url: z.string(),
});

export type ServerFormState =
	| {
			data?: IServer & IErrorBody;
			errors?: {
				errors: string[];
				properties?: {
					name?: {
						errors: string[];
					};
					url?: {
						errors: string[];
					};
				};
			};
			message?: string;
	  }
	| undefined;
