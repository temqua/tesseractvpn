import { tgSessionKey } from '@/app/lib/api/auth';
import env from '@/app/lib/env';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const body = await req.json();
	const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1/auth/tg`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	}).catch(error2 => {
		return NextResponse.json(
			{ message: `Internal server error. Server-side request error: ` + error2.message },
			{ status: 500 },
		);
	});
	const data = await res.json();
	if (!res.ok) {
		return NextResponse.json({ message: data.message }, { status: res.status });
	}
	const response = NextResponse.json({ tg_token: body.id_token }, { status: 200 });

	response.cookies.set(tgSessionKey, body.id_token, {
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		path: '/',
	});
	return response;
}
