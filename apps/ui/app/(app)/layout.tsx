import Header from '../components/header';
import Sidebar from '../components/sidebar';
import styles from './layout.module.css';

export default function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Header />
			<div className={styles.root}>
				<Sidebar />
				<main className={styles.main}>{children}</main>
			</div>
		</>
	);
}
