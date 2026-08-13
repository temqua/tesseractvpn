'use client';
import ContentArea from '@/app/components/content-area';
import FormField from '@/app/components/form-field';
import { createAction } from '@/app/lib/actions/plans';
import { Button } from '@/app/components/button';
import { Input } from '@/app/components/input';
import { useActionState, useState } from 'react';

export default function NewPlan() {
	const [state, formAction, isPendingUpdate] = useActionState(createAction, undefined);

	const [name, setName] = useState('');
	const [monthsCount, setMonthsCount] = useState(1);
	const [price, setPrice] = useState(150);
	const [minCount, setMinCount] = useState(1);
	const [maxCount, setMaxCount] = useState(1);
	const [amount, setAmount] = useState(1);
	return (
		<ContentArea>
			<form action={formAction}>
				<div className="flex flex-col gap-4">
					<FormField id={'name'} label={'Name'} errors={state?.errors?.properties?.name?.errors}>
						<Input
							value={name}
							onChange={event => setName(event.target.value)}
							id="name"
							name="name"
							placeholder="Name"
							aria-invalid={Boolean(state?.errors?.properties?.name?.errors?.length)}
						/>
					</FormField>
					<FormField id={'amount'} label={'Amount'} errors={state?.errors?.properties?.amount?.errors}>
						<Input
							value={amount}
							onChange={event => setAmount(Number(event.target.value))}
							id="amount"
							name="amount"
							placeholder="Amount"
							type="number"
							aria-invalid={Boolean(state?.errors?.properties?.amount?.errors?.length)}
						/>
					</FormField>
					<FormField id={'price'} label={'Price'} errors={state?.errors?.properties?.price?.errors}>
						<Input
							value={price}
							onChange={event => setPrice(Number(event.target.value))}
							id="price"
							name="price"
							type="number"
							placeholder="Price"
							aria-invalid={Boolean(state?.errors?.properties?.price?.errors?.length)}
						/>
					</FormField>
					<FormField
						id={'monthsCount'}
						label={'Months'}
						errors={state?.errors?.properties?.monthsCount?.errors}
					>
						<Input
							value={monthsCount}
							onChange={event => setMonthsCount(Number(event.target.value))}
							id="monthsCount"
							name="monthsCount"
							type="number"
							placeholder="Months Count"
							aria-invalid={Boolean(state?.errors?.properties?.monthsCount?.errors?.length)}
						/>
					</FormField>
					<FormField id={'minCount'} label={'Min count'} errors={state?.errors?.properties?.minCount?.errors}>
						<Input
							value={minCount}
							onChange={event => setMinCount(Number(event.target.value))}
							id="minCount"
							name="minCount"
							placeholder="Min count"
							type="number"
							aria-invalid={Boolean(state?.errors?.properties?.minCount?.errors?.length)}
						/>
					</FormField>
					<FormField id={'maxCount'} label={'Max count'} errors={state?.errors?.properties?.maxCount?.errors}>
						<Input
							value={maxCount}
							onChange={event => setMaxCount(Number(event.target.value))}
							id="maxCount"
							name="maxCount"
							placeholder="Max count"
							type="number"
							aria-invalid={Boolean(state?.errors?.properties?.maxCount?.errors?.length)}
						/>
					</FormField>
					<Button type="submit">Submit</Button>
				</div>
			</form>
		</ContentArea>
	);
}
