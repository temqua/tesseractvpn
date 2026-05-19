'use client';
import { Button } from '@/app/components/button';
import { Input } from '@/app/components/input';
import { Select } from '@/app/components/select';
import { createAction } from '@/app/lib/actions/expenses';
import { useActionState, useState } from 'react';

export default function NewExpensePage() {
	const [state, formAction, isPendingUpdate] = useActionState(createAction, undefined);

	const [amount, setAmount] = useState('');
	const [category, setCategory] = useState('Servers');
	const [description, setDescription] = useState('');
	return (
		<form action={formAction}>
			<div className="flex flex-col">
				<label htmlFor="amount">Amount</label>
				<Input
					value={amount}
					onChange={event => setAmount(event.target.value)}
					id="amount"
					name="amount"
					type="number"
					min={0}
					placeholder="Amount"
				/>
			</div>
			<div className="flex flex-col">
				<label htmlFor="category">Category</label>
				<Select value={category} onChange={event => setCategory(event.target.value)} id="category" name="category">
					<option value="Nalog">Nalog</option>
					<option value="Servers">Servers</option>
				</Select>
			</div>
			<div className="flex flex-col">
				<label htmlFor="description">Description</label>
				<Input
					value={description ?? ''}
					onChange={event => setDescription(event.target.value)}
					id="description"
					name="description"
					placeholder="Description"
				/>
			</div>
			<Button type="submit">Submit</Button>
			{state?.errors?.errors?.length ? state?.errors?.errors.join(',') : ''}
			{state?.data?.id ? `Successfully created expense ${state?.data.id}` : ''}
		</form>
	);
}
