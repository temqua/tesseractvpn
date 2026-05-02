import clsx from 'clsx';
import styles from './select.module.css';
export function Select({ className, children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement>) {
	return (
		<select {...rest} className={clsx(styles.select, className)}>
			{children}
		</select>
	);
}
