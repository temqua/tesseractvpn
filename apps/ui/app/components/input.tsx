export function Input({ className, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
	return (
		<input
			style={{
				border: '1px solid hsl(from var(--background) h s calc(l + 30))',
				padding: '5px 10px',
				borderRadius: '.5rem',
			}}
			{...rest}
			// className={clsx('', className)}
		></input>
	);
}
