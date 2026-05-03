import { useRef, useEffect, useState } from 'react';
import styles from './dialog.module.css';
import { Button } from './button';
interface DialogProps {
	isOpened: boolean;
	onClose: () => void;
	onCancel: () => void;
	onConfirm: () => void;
	children: React.ReactNode;
	modalHeader: string;
}

export default function Dialog({
	isOpened,
	onClose,
	onCancel,
	onConfirm,
	children,
	modalHeader = 'Confirm',
}: DialogProps) {
	const ref = useRef<HTMLDialogElement | null>(null);

	useEffect(() => {
		const dialog = ref.current;
		if (!dialog) return;

		if (isOpened) {
			if (!dialog.open) {
				dialog.showModal();
			}
		} else {
			if (dialog.open) {
				dialog.close();
			}
		}
	}, [isOpened]);

	return (
		<dialog ref={ref} onClose={onClose} className={styles.dialog}>
			<div className={styles.modal}>
				<div className={styles.header}>
					<div className="flex items-center gap-3">
						<span className="text-lg font-bold text-info">{modalHeader}</span>
					</div>
					<button onClick={onClose}>✖️</button>
				</div>
				<div className={styles.main}>{children}</div>
				<div className={styles.footer}>
					<Button onClick={onConfirm}>Confirm</Button>
					<Button onClick={onCancel}>Cancel</Button>
				</div>
			</div>
		</dialog>
	);
}
