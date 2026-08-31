'use client';
import { Button } from '@/app/components/button';
import ContentArea from '@/app/components/content-area';
import FormField from '@/app/components/form-field';
import { Input } from '@/app/components/input';
import { getUpdateAction } from '@/app/lib/actions/payments';
import { IPayment } from '@/app/lib/api/payments/definitions';
import { Calendar } from '@/app/components/calendar';
import { FieldSet } from '@/app/components/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/popover';
import { format, formatDate, formatISO } from 'date-fns';
import { useActionState, useState } from 'react';
import { PaymentFormState } from '../lib/definitions';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/app/components/input-group';
import { isValidDate } from '@/app/lib/utils';
import { CalendarIcon } from 'lucide-react';
export default function PaymentClientSide({ data, id }: { data: IPayment; id: string }) {
	const updateAction = getUpdateAction(id);
	const [state, formAction, isPendingUpdate] = useActionState<PaymentFormState, FormData>(updateAction, {});

	const [paymentDate, setPaymentDate] = useState(data?.paymentDate);
	const [amount, setAmount] = useState(data?.amount);
	const [monthsCount, setMonthsCount] = useState(data?.monthsCount ?? undefined);
	const [expiresOn, setExpiresOn] = useState(data?.expiresOn ?? undefined);
	const [expiresOnDate, setExpiresOnDate] = useState(data.expiresOn ? new Date(data.expiresOn) : undefined);
	const [isExpiresOnOpened, setExpiresOnOpened] = useState(false);
	const [userId, setUserID] = useState(data?.userId);
	const [planId, setPlanID] = useState(data?.planId);
	return (
		<ContentArea>
			<form action={formAction}>
				<FieldSet>
					<FormField
						id="paymentDate"
						label="Payment date"
						errors={state?.errors?.properties?.paymentDate?.errors}
					>
						<Input
							value={paymentDate}
							onChange={event => setPaymentDate(event.target.value)}
							id="paymentDate"
							name="paymentDate"
							placeholder="Payment date"
							aria-invalid={Boolean(state?.errors?.properties?.paymentDate?.errors?.length)}
						/>
					</FormField>
					<FormField id="amount" label="Amount" errors={state?.errors?.properties?.amount?.errors}>
						<Input
							value={amount}
							onChange={event => setAmount(Number(event.target.value))}
							id="amount"
							name="amount"
							type="number"
							autoComplete="off"
							placeholder="Amount"
							step="0.01"
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
							autoComplete="off"
							placeholder="Months count"
							aria-invalid={Boolean(state?.errors?.properties?.monthsCount?.errors?.length)}
						/>
					</FormField>
					<FormField id="expiresOn" label="Expires on" errors={state?.errors?.properties?.expiresOn?.errors}>
						<InputGroup>
							<InputGroupInput
								id="expiresOn"
								name="expiresOn"
								value={expiresOn}
								readOnly
								onChange={e => {
									const date = new Date(e.target.value);
									setExpiresOn(e.target.value);
									if (isValidDate(date)) {
										setExpiresOnDate(date);
									}
								}}
								onKeyDown={e => {
									if (e.key === 'ArrowDown') {
										e.preventDefault();
										setExpiresOnOpened(true);
									}
								}}
								aria-invalid={Boolean(state?.errors?.properties?.expiresOn?.errors?.length)}
							/>
							<InputGroupAddon align="inline-end">
								<Popover open={isExpiresOnOpened} onOpenChange={setExpiresOnOpened}>
									<PopoverTrigger
										render={
											<InputGroupButton
												id="date-picker"
												variant="ghost"
												size="icon-xs"
												aria-label="Select date"
											>
												<CalendarIcon />
												<span className="sr-only">Select date</span>
											</InputGroupButton>
										}
									/>
									<PopoverContent
										className="w-auto overflow-hidden p-0"
										align="end"
										alignOffset={-8}
										sideOffset={10}
									>
										<Calendar
											mode="single"
											selected={expiresOnDate}
											onSelect={date => {
												if (date) {
													setExpiresOnDate(date);
													setExpiresOn(formatISO(date));
												}
												setExpiresOnOpened(false);
											}}
										/>
									</PopoverContent>
								</Popover>
							</InputGroupAddon>
						</InputGroup>
						{/* <Input
							value={expiresOn}
							onChange={event => setExpiresOn(event.target.value)}
							id="expiresOn"
							name="expiresOn"
							autoComplete="off"
							placeholder="Expires On"
							aria-invalid={Boolean(state?.errors?.properties?.expiresOn?.errors?.length)}
						/> */}
					</FormField>
					<FormField id="userId" label="User ID" errors={state?.errors?.properties?.userId?.errors}>
						<Input
							value={userId}
							onChange={event => setUserID(Number(event.target.value))}
							id="userId"
							name="userId"
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
