'use client';
import { useQuery } from '@tanstack/react-query';
import { expensesClient } from '@/app/lib/api/expenses/client';
import { use } from 'react';
import { Input } from '../../../components/input';
export default function ExpensePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	const { isPending, error, data } = useQuery({
		queryKey: ['expense'],
		queryFn: () => expensesClient.getById(id),
	});
	if (isPending) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>Error {error.message}</div>;
	}
	return (
		<div>
			<div className="flex flex-col">
				<label htmlFor="paymentDate">Payment date</label>
				<Input value={data.paymentDate} id="paymentDate" name="paymentDate" placeholder="Payment date" />
			</div>
			<div className="flex flex-col">
				<label htmlFor="amount">Amount</label>
				<Input value={data.amount} id="amount" name="amount" placeholder="Amount" />
			</div>
			<div className="flex flex-col">
				<label htmlFor="category">Category</label>
				<Input value={data.category} id="category" name="category" placeholder="Category" />
			</div>
			<div className="flex flex-col">
				<label htmlFor="description">Description</label>
				<Input value={data.description ?? ''} id="description" name="description" placeholder="Description" />
			</div>
		</div>
	);
}
