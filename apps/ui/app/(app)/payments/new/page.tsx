'use client';
import ContentArea from '@/app/components/content-area';
import FormField from '@/app/components/form-field';
import { createAction } from '@/app/lib/actions/payments';
import { Button } from '@/app/components/button';
import { FieldSet } from '@/app/components/field';
import { Input } from '@/app/components/input';
import { PaymentFormState } from '@/features/payments/lib/definitions';
import { useActionState, useState } from 'react';

export default function NewPaymentPage() {
	const [state, formAction, isPendingUpdate] = useActionState<PaymentFormState, FormData>(createAction, {});

	const [amount, setAmount] = useState(0);
	const [monthsCount, setMonthsCount] = useState(0);
	const [expiresOn, setExpiresOn] = useState('');
	const [userId, setUserID] = useState(0);
	// const [planId, setPlanID] = useState(data?.planId);
	return (
		<ContentArea>
			<form action={formAction}>
				<FieldSet>
					<FormField id="amount" label="Amount" errors={state?.errors?.properties?.amount?.errors}>
						<Input
							value={amount}
							onChange={event => setAmount(Number(event.target.value))}
							id="amount"
							name="amount"
							type="number"
							autoComplete="off"
							placeholder="Amount"
							aria-invalid={Boolean(state?.errors?.properties?.amount?.errors?.length)}
						/>
					</FormField>
					<FormField
						id="monthsCount"
						label="Months count"
						errors={state?.errors?.properties?.monthsCount?.errors}
					>
						<Input
							value={monthsCount}
							onChange={event => setMonthsCount(Number(event.target.value))}
							id="monthsCount"
							name="monthsCount"
							type="number"
							min="1"
							autoComplete="off"
							placeholder="Months count"
							aria-invalid={Boolean(state?.errors?.properties?.monthsCount?.errors?.length)}
						/>
					</FormField>
					<FormField id="expiresOn" label="Expires on" errors={state?.errors?.properties?.expiresOn?.errors}>
						<Input
							value={expiresOn}
							onChange={event => setExpiresOn(event.target.value)}
							id="expiresOn"
							name="expiresOn"
							autoComplete="off"
							placeholder="Expires On"
							aria-invalid={Boolean(state?.errors?.properties?.expiresOn?.errors?.length)}
						/>
					</FormField>
					<FormField id="userId" label="User ID" errors={state?.errors?.properties?.userId?.errors}>
						<Input
							value={userId}
							onChange={event => setUserID(Number(event.target.value))}
							id="userId"
							name="userId"
							min="1"
							autoComplete="off"
							placeholder="User ID"
							type="number"
							aria-invalid={Boolean(state?.errors?.properties?.userId?.errors?.length)}
						/>
					</FormField>
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
				</FieldSet>
			</form>
		</ContentArea>
	);
}
