import clsx from 'clsx';
import styles from './input.module.css';
export function Input({ className, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
	return <input {...rest} className={clsx(styles.input, className)}></input>;
}
