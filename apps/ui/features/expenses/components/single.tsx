'use client';
import { Button } from '@/app/components/button';
import { Input } from '@/app/components/input';
import { Select } from '@/app/components/select';
import { getUpdateAction } from '@/app/lib/actions/expenses';
import { IExpense } from '@/app/lib/api/expenses/definitions';
import { useActionState, useState } from 'react';
import { ExpenseFormState } from '../lib/definitions';
export default function ExpenseClientSide({ data, id }: { data: IExpense; id: string }) {
	// const { isPending, error, data } = useQuery({
	// 	queryKey: [`expense-${id}`],
	// 	queryFn: () => expensesClient.getById(id),
	// });
	const [state, formAction, isPendingUpdate] = useActionState<ExpenseFormState>(getUpdateAction(id), null);

	const [paymentDate, setPaymentDate] = useState(data?.paymentDate);
	const [amount, setAmount] = useState(data?.amount.toString());
	const [category, setCategory] = useState(data?.category);
	const [description, setDescription] = useState(data?.description);
	// if (isPending) {
	// 	return <div>Loading...</div>;
	// }
	// if (error) {
	// 	return <div>Error {error.message}</div>;
	// }
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
				<Select
					value={category}
					onChange={event => setCategory(event.target.value)}
					id="category"
					name="category"
				>
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
