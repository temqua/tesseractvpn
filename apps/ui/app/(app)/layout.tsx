'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import styles from './layout.module.css';
import { Suspense } from 'react';
import ContentArea from '../components/content-area';
const queryClient = new QueryClient();

export default function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<QueryClientProvider client={queryClient}>
			<Header />
			<div className={styles.root}>
				<Sidebar />
				<Suspense fallback={<ContentArea>Loading...</ContentArea>}>
					<main className={styles.main}>
						<div className={styles.content}>{children}</div>
					</main>
				</Suspense>
			</div>
		</QueryClientProvider>
	);
}
