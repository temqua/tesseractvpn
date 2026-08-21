import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import ContentArea from '../components/content-area';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import { AuthProvider } from './auth-provider';
import styles from './layout.module.css';
import QueryClientProviderWrapped from './query-client-init';

export default function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<div>
				<Toaster />
			</div>

			<Header />
			<div className={styles.root}>
				<Sidebar />
				<Suspense fallback={<ContentArea>Loading...</ContentArea>}>
					<main className={styles.main}>
						<AuthProvider>
							<QueryClientProviderWrapped>
								<div className={styles.content}>{children}</div>
							</QueryClientProviderWrapped>
						</AuthProvider>
					</main>
				</Suspense>
			</div>
		</>
	);
}
