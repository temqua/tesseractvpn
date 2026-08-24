import { NextRequest, NextResponse } from 'next/server';
import { authSessionKey, parseJWT, tgSessionKey } from '@/app/lib/api/auth';
import { UserRole } from './app/lib/enums';

const publicRoutes = ['auth', 'login', 'logout', 'favicon.ico', '.well-known'];

export function proxy(request: NextRequest) {
	const adminRoute = request.nextUrl.pathname.includes('admin');
	if (adminRoute) {
		const cookie = request.cookies.get(authSessionKey);
		if (!cookie) {
			return NextResponse.redirect(new URL('/login', request.url));
		}
		const token = cookie.value;
		const parsed = parseJWT(token);
		if (parsed.role !== UserRole.ADMIN) {
			return NextResponse.redirect(new URL('/', request.url));
		}
	}
	if (
		!request.cookies.has(authSessionKey) &&
		!request.cookies.has(tgSessionKey) &&
		!publicRoutes.some(route => request.nextUrl.pathname.includes(route))
	) {
		return NextResponse.redirect(new URL('/login', request.url));
	}
	return NextResponse.next();
}

export const config = {
	// https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
