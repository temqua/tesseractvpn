import Link from 'next/link';
import styles from './sidebar-item.module.css';
export default function SidebarItem({ href, label }: { href: string; label: string }) {
	return (
		<div className={styles.item}>
			<Link href={href}>{label}</Link>
		</div>
	);
}
