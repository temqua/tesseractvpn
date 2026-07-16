import clsx from 'clsx';
import styles from './button.module.css';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

export function Button({ children, className, disabled, ...rest }: ButtonProps) {
	return (
		<button
			{...rest}
			disabled={disabled ?? false}
			className={clsx(
				'',
				className,
				'h-10 rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
				styles.button,
			)}
		>
			{children}
		</button>
	);
}
