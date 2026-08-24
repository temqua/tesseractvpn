import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import ContentArea from '../components/content-area';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import { UserProvider } from './user-provider';
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
				<UserProvider>
					<Sidebar />
					<Suspense fallback={<ContentArea>Loading...</ContentArea>}>
						<main className={styles.main}>
							<QueryClientProviderWrapped>
								<div className={styles.content}>{children}</div>
							</QueryClientProviderWrapped>
						</main>
					</Suspense>
				</UserProvider>
			</div>
		</>
	);
}
