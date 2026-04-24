import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
	if (request.nextUrl.pathname.includes('/play')) {
		return NextResponse.next();
	}
	if (!request.cookies.has('session_id') && !request.nextUrl.pathname.includes('login')) {
		return NextResponse.redirect(new URL('/login', request.url));
	}
	return NextResponse.next();
}

export const config = {
	// https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
