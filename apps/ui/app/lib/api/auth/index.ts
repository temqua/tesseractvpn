export const authSessionKey = 'tesseract_user_session';
export const tgSessionKey = 'tesseract_tg_user_session';

export function checkJWT(token: string | undefined): boolean {
	if (typeof token !== 'string') {
		return false;
	}
	return token?.split('.')?.length === 3;
}

export function parseJWT(token: string): IJWToken {
	const base64Url: string = token.split('.')[1];
	const base64: string = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	const jsonPayload: string = decodeURIComponent(
		atob(base64)
			.split('')
			.map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
			.join(''),
	);

	return JSON.parse(jsonPayload);
}

export interface IJWToken {
	id: number;
	username: string;
	iat: number;
	exp: number;
}

export type TGUser = {
	aud: string;
	exp: number;
	family_name: string;
	given_name: string;
	iat: number;
	id: string;
	iss: string;
	name: string;
	picture: string;
	preferred_username: string;
	sub: string;
};

export type TGAuthParams = {
	id_token: string;
	user: TGUser;
};
