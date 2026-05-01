import styles from './content-area.module.css';

export default function ContentArea({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div className={styles.area}>{children}</div>;
}
