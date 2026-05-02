import Link from 'next/link';
import styles from './sidebar-item.module.css';
export default function SidebarItem({ href, label, active }: { href: string; label: string; active?: boolean }) {
	return (
		<div className={`${styles.item} ${active ? styles.active : ''}`}>
			<Link href={href}>{label}</Link>
		</div>
	);
}
