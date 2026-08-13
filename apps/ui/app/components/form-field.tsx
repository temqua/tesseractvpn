import { Field, FieldDescription, FieldLabel } from './field';
import { ReactNode } from 'react';
export default function FormField({
	id,
	label,
	errors,
	children,
}: {
	id: string;
	label: string;
	errors?: string[];
	children?: ReactNode;
}) {
	return (
		<Field data-invalid={errors?.length}>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			{children}
			{errors && <FieldDescription>{errors.join()}</FieldDescription>}
		</Field>
	);
}
