export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export function debounce(func: Function, wait: number) {
	let timeoutId: number | null = null;

	return (...args: any[]) => {
		clearTimeout(timeoutId!);
		timeoutId = window.setTimeout(() => func(...args), wait);
	};
}
