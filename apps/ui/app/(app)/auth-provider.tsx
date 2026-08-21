// context/AuthContext.tsx
'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authSessionKey, parseJWT, tgSessionKey } from '../lib/api/auth';

const AuthContext = createContext<{ token: string | null; tgToken: string | null }>({ token: null, tgToken: null });

export function AuthProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useState<string | null>(null);
	const [tgToken, setTgToken] = useState<string | null>(null);

	useEffect(() => {
		const savedToken = localStorage.getItem(authSessionKey);
		setToken(savedToken);
		const savedTgToken = localStorage.getItem(tgSessionKey);
		setTgToken(savedTgToken);
	}, []);

	return <AuthContext.Provider value={{ token, tgToken }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
