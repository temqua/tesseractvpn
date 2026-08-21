import { tgSessionKey } from '@/app/lib/api/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const body = await req.json();

	const response = NextResponse.json({ token: body.id_token }, { status: 200 });

	response.cookies.set(tgSessionKey, body.id_token, {
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		path: '/',
	});
	return response;
}
