import { Field, FieldDescription, FieldLabel } from './field';
import { ReactNode } from 'react';
export default function FormField({
	id,
	label,
	errors,
	children,
	orientation,
	className,
}: {
	id: string;
	label: string;
	errors?: string[];
	children?: ReactNode;
	orientation?: 'vertical' | 'horizontal' | 'responsive';
	className?: string;
}) {
	return (
		<Field className={className} orientation={orientation} data-invalid={errors?.length}>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			{children}
			{errors && <FieldDescription>{errors.join()}</FieldDescription>}
		</Field>
	);
}
