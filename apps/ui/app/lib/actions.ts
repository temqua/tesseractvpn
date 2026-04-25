export async function authenticate(prevState: string | undefined, formData: FormData) {
	try {
		// await signIn('credentials', formData);
		// await
	} catch (error) {
		throw error;
	}
}

export async function auth(prevState: string, formData: FormData) {
	const username = formData.get('username');
	const password = formData.get('password');

	try {
		await new Promise(res => setTimeout(res, 1000));
	} catch (error) {
		throw error;
	}

	if (password !== '1234') {
		return { error: 'Invalid password' };
	}
}
