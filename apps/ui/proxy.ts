import { NextRequest, NextResponse } from 'next/server';
import { authSessionKey } from '@/app/lib/api/auth';

const publicRoutes = ['auth', 'login', 'favicon.ico', '.well-known'];

export function proxy(request: NextRequest) {
	if (!request.cookies.has(authSessionKey) && !publicRoutes.some(route => request.nextUrl.pathname.includes(route))) {
		return NextResponse.redirect(new URL('/login', request.url));
	}
	return NextResponse.next();
}

export const config = {
	// https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
