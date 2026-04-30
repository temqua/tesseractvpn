'use client';
export class AuthClient {
	async auth(username: string, password: string): Promise<{ success: boolean; token: string }> {
		const response = await fetch('/api/auth/login', {
			method: 'POST',
			body: JSON.stringify({
				username,
				password,
			}),
		});
		const isJson = response.headers.get('Content-Type')?.includes('application/json');
		if (!response.ok && response.body && isJson) {
			const errorBody = await response.json();
			if (!errorBody.message) {
				throw new Error(JSON.stringify(errorBody));
			}
			throw new Error(errorBody.message);
		}
		if (!response.ok) {
			throw new Error(response.statusText);
		}
		return await response.json();
	}

	async logout() {
		const response = await fetch('/api/auth/logout', {
			method: 'POST',
		});
		const isJson = response.headers.get('Content-Type')?.includes('application/json');
		if (!response.ok && response.body && isJson) {
			const errorBody = await response.json();
			if (!errorBody.message) {
				throw new Error(JSON.stringify(errorBody));
			}
			throw new Error(errorBody.message);
		}
		if (!response.ok) {
			throw new Error(response.statusText);
		}
		return await response.json();
	}
}
export const authClient = new AuthClient();
