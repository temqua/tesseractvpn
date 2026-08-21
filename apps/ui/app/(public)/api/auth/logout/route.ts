import { NextResponse } from 'next/server';
import { authSessionKey, tgSessionKey } from '../../../../lib/api/auth';

export async function POST(req: Request) {
	const response = NextResponse.json({ success: true }, { status: 200 });

	response.cookies.delete(authSessionKey);
	response.cookies.delete(tgSessionKey);
	return response;
}
