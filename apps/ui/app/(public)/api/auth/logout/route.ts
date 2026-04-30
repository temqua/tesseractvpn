import { NextResponse } from 'next/server';
import { authSessionKey } from '../../../../lib/api/auth';

export async function POST(req: Request) {
	const response = NextResponse.json({ success: true }, { status: 200 });

	response.cookies.delete(authSessionKey);
	return response;
}
