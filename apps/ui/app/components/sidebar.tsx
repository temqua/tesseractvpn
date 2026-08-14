'use client';
import { usePathname } from 'next/navigation';
import SidebarItem from './sidebar-item';
import styles from './sidebar.module.css';
export default function Sidebar() {
	const pathname = usePathname();
	return (
		<aside className={styles.aside}>
			<nav className={styles['sidebar-main']}>
				<SidebarItem active={pathname === '/users'} href="/users" label="Users" />
				<SidebarItem active={pathname === '/payments'} href="/payments" label="Payments" />
				<SidebarItem
					active={pathname === '/referral-transactions'}
					href="/referral-transactions"
					label="Referral Payments"
				/>
				<SidebarItem active={pathname === '/expenses'} href="/expenses" label="Expenses" />
				<SidebarItem
					active={pathname === '/bot-incoming-messages'}
					href="/bot-incoming-messages"
					label="Incoming Messages"
				/>
				<SidebarItem
					active={pathname === '/bot-delivered-messages'}
					href="/bot-delivered-messages"
					label="Delivered Messages"
				/>
				<SidebarItem
					active={pathname === '/bot-unauthorized-delivered-messages'}
					href="/bot-unauthorized-delivered-messages"
					label="Unauthorized Delivered Messages"
				/>
				<SidebarItem active={pathname === '/plans'} href="/plans" label="Plans" />
				<SidebarItem active={pathname === '/servers'} href="/servers" label="Servers" />
			</nav>
		</aside>
	);
}
