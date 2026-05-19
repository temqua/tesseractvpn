import { useState } from 'react';
import Dialog from './dialog';

export default function ConfirmDialog({ message }: { message: string }) {
	const [open, setOpen] = useState(false);

	return (
		<div>
			<button onClick={() => setOpen(true)}>Открыть</button>

			<Dialog isOpened={open} onClose={() => setOpen(false)} onConfirm={() => {}}>
				<p>{message}</p>
			</Dialog>
		</div>
	);
}
