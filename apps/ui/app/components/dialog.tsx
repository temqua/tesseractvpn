import { useRef, useEffect } from 'react';

interface DialogProps {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

export default function Dialog({ open, onClose, children }: DialogProps) {
	const ref = useRef<HTMLDialogElement | null>(null);

	useEffect(() => {
		const dialog = ref.current;
		if (!dialog) return;

		if (open) {
			if (!dialog.open) {
				dialog.showModal();
			}
		} else {
			if (dialog.open) {
				dialog.close();
			}
		}
	}, [open]);

	return (
		<dialog ref={ref} onClose={onClose}>
			{children}
		</dialog>
	);
}
