import { NextResponse } from 'next/server';
import env from '@/app/lib/env';
import { authSessionKey } from '@/app/lib/api/auth';

export async function POST(req: Request) {
	const body = await req.json();
	const res = await fetch(`${env.API_URL}/api/v1/auth`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	}).catch(error2 => {
		return NextResponse.json(
			{ error: `Internal server error. Server-side request error: ` + error2.message },
			{ status: 500 },
		);
	});
	const data = await res.json();
	if (!res.ok) {
		return NextResponse.json({ message: data.message }, { status: res.status });
	}

	const response = NextResponse.json({ success: true, token: data.accessToken });

	response.cookies.set(authSessionKey, data.accessToken, {
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		path: '/',
	});
	return response;
}
