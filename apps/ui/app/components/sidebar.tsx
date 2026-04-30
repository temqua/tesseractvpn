'use client';
import { useActionState } from 'react';
import { signOut } from '../lib/actions/auth';
import SidebarItem from './sidebar-item';
import styles from './sidebar.module.css';
export default function Sidebar() {
	const [state, formAction, isPending] = useActionState(signOut, undefined);

	return (
		<aside className={styles.aside}>
			<nav className={styles['sidebar-main']}>
				<SidebarItem href="/users" label="Users" />
				<SidebarItem href="/payments" label="Payments" />
				<SidebarItem href="/expenses" label="Expenses" />
			</nav>
			<div className={styles['sidebar-bottom']}>
				<form action={formAction}>
					<button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
						<div className="hidden md:block">Sign Out</div>
					</button>
				</form>
			</div>
		</aside>
	);
}
