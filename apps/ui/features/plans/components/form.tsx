'use client';
import { Button } from '@/app/components/button';
import ContentArea from '@/app/components/content-area';
import FormField from '@/app/components/form-field';
import { getUpdateAction } from '@/app/lib/actions/plans';
import { IPlan } from '@/app/lib/api/plans/definitions';
import { useActionState, useState } from 'react';
import { PlanFormState } from '../lib/definitions';
import { Input } from '@/app/components/input';
import { FieldSet } from '@/app/components/field';
export default function PlanClientSide({ data, id }: { data: IPlan; id: string }) {
	const updateAction = getUpdateAction(id);
	const [state, formAction, isPendingUpdate] = useActionState<PlanFormState, FormData>(updateAction, {});
	const [name, setName] = useState(data?.name);
	const [months, setMonths] = useState(data?.months);
	const [price, setPrice] = useState(data?.price);
	const [minCount, setMinCount] = useState(data?.minCount);
	const [maxCount, setMaxCount] = useState(data?.maxCount);
	const [amount, setAmount] = useState(data?.amount);
	return (
		<ContentArea>
			<form action={formAction}>
				<FieldSet>
					<FormField id={'name'} label={'Name'} errors={state?.errors?.properties?.name?.errors}>
						<Input
							value={name}
							onChange={event => setName(event.target.value)}
							id="name"
							name="name"
							placeholder="Name"
							aria-invalid={Boolean(state?.errors?.properties?.name?.errors?.length)}
							required
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
					<FormField id={'months'} label={'Months'} errors={state?.errors?.properties?.monthsCount?.errors}>
						<Input
							value={months}
							onChange={event => setMonths(Number(event.target.value))}
							id="months"
							name="months"
							type="number"
							placeholder="Months"
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
				</FieldSet>
			</form>
		</ContentArea>
	);
}
