import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export function debounce(func: Function, wait: number) {
	let timeoutId: number | null = null;

	return (...args: any[]) => {
		clearTimeout(timeoutId!);
		timeoutId = window.setTimeout(() => func(...args), wait);
	};
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isValidDate(date: Date | undefined) {
	if (!date) {
		return false;
	}
	return !isNaN(date.getTime());
}
