import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useCallback } from 'react';

export function useUpdateParams(router: AppRouterInstance, pathname: string) {
	return useCallback(
		(updates: Record<string, string | number | null>) => {
			// window.location.search вместо searchParams — чтобы не ловить protухшее
			// замыкание внутри debounce (см. ниже)
			const params = new URLSearchParams(window.location.search);
			for (const [key, value] of Object.entries(updates)) {
				if (value === null || value === '') params.delete(key);
				else params.set(key, String(value));
			}
			router.push(`${pathname}?${params.toString()}`, { scroll: false });
		},
		[pathname, router],
	);
}
