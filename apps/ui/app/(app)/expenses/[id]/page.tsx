'use client';
import { useQuery } from '@tanstack/react-query';
import { expensesClient } from '@/app/lib/api/expenses/client';
import { use, useActionState, useState } from 'react';
import { Input } from '../../../components/input';
import { updateAction } from '../../../lib/actions/expenses';
import { Select } from '../../../components/select';
import { Button } from '../../../components/button';
export default function ExpensePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	const { isPending, error, data } = useQuery({
		queryKey: [`expense-${id}`],
		queryFn: () => expensesClient.getById(id),
	});
	const [state, formAction, isPendingUpdate] = useActionState(updateAction, undefined);

	const [paymentDate, setPaymentDate] = useState(data?.paymentDate);
	const [amount, setAmount] = useState(data?.amount);
	const [category, setCategory] = useState(data?.category);
	const [description, setDescription] = useState(data?.description);
	if (isPending) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>Error {error.message}</div>;
	}
	return (
		<form action={formAction}>
			<div className="flex flex-col">
				<label htmlFor="paymentDate">Payment date</label>
				<Input
					value={paymentDate}
					onChange={event => setPaymentDate(event.target.value)}
					id="paymentDate"
					name="paymentDate"
					type="datetime"
					placeholder="Payment date"
				/>
			</div>
			<div className="flex flex-col">
				<label htmlFor="amount">Amount</label>
				<Input
					value={amount}
					onChange={event => setAmount(event.target.value)}
					id="amount"
					name="amount"
					placeholder="Amount"
				/>
			</div>
			<div className="flex flex-col">
				<label htmlFor="category">Category</label>
				<Select onChange={event => setCategory(event.target.value)} id="category" name="category">
					<option value=""></option>
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
		</form>
	);
}
