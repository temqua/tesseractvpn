import { useState } from 'react';
import Dialog from './dialog';

export default function ConfirmDialog({ message }: { message: string }) {
	const [open, setOpen] = useState(false);

	return (
		<div>
			<button onClick={() => setOpen(true)}>Открыть</button>

			<Dialog open={open} onClose={() => setOpen(false)}>
				<h2>Подтверждение</h2>
				<p>{message}</p>
				<button onClick={() => setOpen(false)}>Закрыть</button>
			</Dialog>
		</div>
	);
}
