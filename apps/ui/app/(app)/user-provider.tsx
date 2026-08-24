'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authSessionKey, parseJWT, tgSessionKey } from '../lib/api/auth';
import { UserRole } from '../lib/enums';

const UserContext = createContext<{ token: string | null; tgToken: string | null; role: string | null }>({
	token: null,
	tgToken: null,
	role: null,
});

export function UserProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useState<string | null>(null);

	const [tgToken, setTgToken] = useState<string | null>(null);
	const [role, setRole] = useState<UserRole | null>(null);

	useEffect(() => {
		const savedToken = localStorage.getItem(authSessionKey);
		setToken(savedToken);
		const savedTgToken = localStorage.getItem(tgSessionKey);
		setTgToken(savedTgToken);

		if (savedToken) {
			const user = parseJWT(savedToken);
			setRole(user.role);
			console.log('user in context useEffect: ', user);
		}
	}, []);

	return <UserContext.Provider value={{ token, tgToken, role }}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
