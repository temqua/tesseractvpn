'use client';
import { Input } from '@/app/components/input';
import { getUpdateAction } from '@/app/lib/actions/payments';
import { IPayment } from '@/app/lib/api/payments/definitions';
import { useActionState, useState } from 'react';
import { PaymentFormState } from '../lib/definitions';
import { Button } from '@/app/components/button';

export default function PaymentClientSide({ data, id }: { data: IPayment; id: string }) {
	const updateAction = getUpdateAction(id);
	const [state, formAction, isPendingUpdate] = useActionState<PaymentFormState, FormData>(updateAction, {});

	const [paymentDate, setPaymentDate] = useState(data?.paymentDate);
	const [amount, setAmount] = useState(data?.amount);
	const [monthsCount, setMonthsCount] = useState(data?.monthsCount);
	const [expiresOn, setExpiresOn] = useState(data?.expiresOn);
	const [userId, setUserID] = useState(data?.userId);
	const [planId, setPlanID] = useState(data?.planId);
	return (
		<form action={formAction}>
			<div className="flex flex-col">
				<label htmlFor="paymentDate">Payment date</label>
				<Input
					value={paymentDate}
					onChange={event => setPaymentDate(event.target.value)}
					id="paymentDate"
					name="paymentDate"
					placeholder="Payment date"
				/>
			</div>
			<div className="flex flex-col">
				<label htmlFor="amount">Amount</label>
				<Input
					value={amount}
					onChange={event => setAmount(Number(event.target.value))}
					id="amount"
					name="amount"
					type="number"
					autoComplete="off"
					placeholder="Amount"
				/>
			</div>
			{state?.errors?.properties?.amount && <p>{state.errors?.properties.amount?.errors.join()}</p>}
			<div className="flex flex-col">
				<label htmlFor="monthsCount">Months count</label>
				<Input
					value={monthsCount}
					onChange={event => setMonthsCount(Number(event.target.value))}
					id="monthsCount"
					name="monthsCount"
					type="number"
					autoComplete="off"
					placeholder="Months count"
				/>
			</div>
			{state?.errors?.properties?.monthsCount && <p>{state.errors?.properties.monthsCount?.errors.join()}</p>}
			<div className="flex flex-col">
				<label htmlFor="expiresOn">Expires on</label>
				<Input
					value={expiresOn}
					onChange={event => setExpiresOn(event.target.value)}
					id="expiresOn"
					name="expiresOn"
					autoComplete="off"
					placeholder="Expires On"
				/>
			</div>
			{state?.errors?.properties?.expiresOn && <p>{state.errors?.properties.expiresOn?.errors.join()}</p>}
			<div className="flex flex-col">
				<label htmlFor="userId">User ID</label>
				<Input
					value={userId}
					onChange={event => setUserID(Number(event.target.value))}
					id="userId"
					name="userId"
					autoComplete="off"
					placeholder="User ID"
				/>
			</div>
			{state?.errors?.properties?.userId && <p>{state.errors?.properties.userId?.errors.join()}</p>}
			{/* <div className="flex flex-col">
                <label htmlFor="planId">Plan ID</label>
                <Input
                    value={planId}
                    onChange={event => setPlanID(Number(event.target.value))}
                    id="planId"
                    name="planId"
                    autoComplete="off"
                    placeholder="Plan ID"
                />
            </div>
            {state?.errors?.properties?.planId && <p>{state.errors?.properties.planId?.errors.join()}</p>} */}
			<Button type="submit">Submit</Button>
		</form>
	);
}
