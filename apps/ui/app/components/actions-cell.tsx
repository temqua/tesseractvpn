import { ReactNode } from 'react';
import styles from './actions-cell.module.css';
export default function ActionsCell({ children }: { children: ReactNode }) {
	return <div className={styles.actions}>{children}</div>;
}
