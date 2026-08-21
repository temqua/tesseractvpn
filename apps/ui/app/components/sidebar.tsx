'use client';
import { usePathname } from 'next/navigation';
import { useAuth } from '../(app)/auth-provider';
import SidebarItem from './sidebar-item';
import styles from './sidebar.module.css';
export default function Sidebar() {
	const pathname = usePathname();
	const auth = useAuth();
	const row = auth.token ? (
		<>
			<SidebarItem active={pathname === '/admin/users'} href="/admin/users" label="Users" />
			<SidebarItem active={pathname === '/admin/payments'} href="/admin/payments" label="Payments" />
			<SidebarItem
				active={pathname === '/admin/referral-transactions'}
				href="/admin/referral-transactions"
				label="Referral Payments"
			/>
			<SidebarItem active={pathname === '/admin/expenses'} href="/admin/expenses" label="Expenses" />
			<SidebarItem
				active={pathname === '/admin/bot-incoming-messages'}
				href="/admin/bot-incoming-messages"
				label="Incoming Messages"
			/>
			<SidebarItem
				active={pathname === '/admin/bot-delivered-messages'}
				href="/admin/bot-delivered-messages"
				label="Delivered Messages"
			/>
			<SidebarItem
				active={pathname === '/admin/bot-unauthorized-delivered-messages'}
				href="/admin/bot-unauthorized-delivered-messages"
				label="Unauthorized Delivered Messages"
			/>
			<SidebarItem active={pathname === '/admin/plans'} href="/admin/plans" label="Plans" />
			<SidebarItem active={pathname === '/admin/servers'} href="/admin/servers" label="Servers" />
		</>
	) : (
		<>
			<SidebarItem active={pathname === '/payments'} href="/payments" label="Платежи" />
			<SidebarItem active={pathname === '/prices'} href="/prices" label="Цены" />
			<SidebarItem active={pathname === '/keys'} href="/keys" label="Ключи" />
		</>
	);
	return (
		<aside className={styles.aside}>
			<nav className={styles.sidebarMain}>{row}</nav>
		</aside>
	);
}
