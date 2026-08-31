'use client';
import { usePathname } from 'next/navigation';
import { useUser } from '../(app)/user-provider';
import SidebarItem from './sidebar-item';
import styles from './sidebar.module.css';
import { UserRole } from '../lib/enums';
export default function Sidebar() {
	const pathname = usePathname();
	const user = useUser();
	const row =
		user.role === UserRole.ADMIN ? (
			<>
				<SidebarItem active={pathname.includes('/admin/users')} href="/admin/users" label="Users" />
				<SidebarItem active={pathname.includes('/admin/payments')} href="/admin/payments" label="Payments" />
				<SidebarItem
					active={pathname.includes('/admin/referral-transactions')}
					href="/admin/referral-transactions"
					label="Referral Payments"
				/>
				<SidebarItem active={pathname.includes('/admin/expenses')} href="/admin/expenses" label="Expenses" />
				<SidebarItem
					active={pathname.includes('/admin/bot-incoming-messages')}
					href="/admin/bot-incoming-messages"
					label="Incoming Messages"
				/>
				<SidebarItem
					active={pathname.includes('/admin/bot-delivered-messages')}
					href="/admin/bot-delivered-messages"
					label="Delivered Messages"
				/>
				<SidebarItem
					active={pathname.includes('/admin/bot-unauthorized-delivered-messages')}
					href="/admin/bot-unauthorized-delivered-messages"
					label="Unauthorized Delivered Messages"
				/>
				<SidebarItem active={pathname.includes('/admin/plans')} href="/admin/plans" label="Plans" />
				<SidebarItem active={pathname.includes('/admin/servers')} href="/admin/servers" label="Servers" />
			</>
		) : (
			<>
				<SidebarItem active={pathname.includes('/payments')} href="/payments" label="Платежи" />
				<SidebarItem active={pathname.includes('/prices')} href="/prices" label="Цены" />
				<SidebarItem active={pathname.includes('/keys')} href="/keys" label="Ключи" />
			</>
		);
	return (
		<aside className={styles.aside}>
			<nav className={styles.sidebarMain}>{row}</nav>
		</aside>
	);
}
