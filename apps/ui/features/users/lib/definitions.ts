import { IVPNUserUI } from '@/app/lib/api/users/definitions';
import { IErrorBody } from '@/app/lib/definitions.global';
import z from 'zod';

export const UserCreateFormSchema = z.object({
	username: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	telegramId: z.string(),
	price: z.number(),
	rwLink: z.string(),
	free: z.boolean(),
	active: z.boolean(),
});

export const UserEditFormSchema = z.object({
	username: z.string().optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	telegramId: z.string().optional(),
	price: z.number().optional(),
	rwLink: z.string().optional(),
	free: z.boolean().optional(),
	active: z.boolean().optional(),
});

export type UserFormState =
	| {
			data?: IVPNUserUI & IErrorBody;
			errors?: {
				errors: string[];
				properties?: {
					username?: {
						errors: string[];
					};
					telegramId?: {
						errors: string[];
					};
					telegramLink?: {
						errors: string[];
					};
					createdAt?: {
						errors: string[];
					};
					firstName?: {
						errors: string[];
					};
					lastName?: {
						errors: string[];
					};
					price?: {
						errors: string[];
					};
					free?: {
						errors: string[];
					};
					active?: {
						errors: string[];
					};
					rwLink?: {
						errors: string[];
					};
				};
			};
			message?: string;
	  }
	| undefined;
