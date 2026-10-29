'use client';
import { Button } from '@/app/components/button';
import { Calendar } from '@/app/components/calendar';
import ContentArea from '@/app/components/content-area';
import { FieldSet } from '@/app/components/field';
import FormField from '@/app/components/form-field';
import { Input } from '@/app/components/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/app/components/input-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/popover';
import { getUpdateAction } from '@/app/lib/actions/payments';
import { IPayment } from '@/app/lib/api/payments/definitions';
import { isValidDate } from '@/app/lib/utils';
import { formatISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useActionState, useState } from 'react';
import { PaymentFormState } from '../lib/definitions';
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from '@/app/components/combobox';
import { PaymentStatus } from '@/app/lib/enums';
import { Select } from '@/app/components/select';

interface IPaymentFormProps {
	users: {
		label: string;
		value: string;
	}[];
	plans: {
		label: string;
		value: string;
	}[];
	data: IPayment;
	id: string;
}
export default function PaymentClientSide({ data, id, users, plans }: IPaymentFormProps) {
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
	const [status, setStatus] = useState(data.status);
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
					{/* <FormField id="userId" label="User ID" errors={state?.errors?.properties?.userId?.errors}>
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
					</FormField> */}
					<FormField id="userId" label="User" errors={state?.errors?.properties?.userId?.errors}>
						<Combobox
							items={users}
							value={userId ?? undefined}
							name="userId"
							onValueChange={v => {
								setUserID(Number(v));
							}}
						>
							<ComboboxInput placeholder="Select user"></ComboboxInput>
							<ComboboxContent>
								<ComboboxEmpty>No users found.</ComboboxEmpty>
								<ComboboxList>
									{item => (
										<ComboboxItem key={item.value} value={item.value}>
											{item.label}
										</ComboboxItem>
									)}
								</ComboboxList>
							</ComboboxContent>
						</Combobox>
					</FormField>
					<FormField id="planId" label="Plan" errors={state?.errors?.properties?.planId?.errors}>
						<Combobox
							name="planId"
							items={plans}
							value={planId ?? undefined}
							onValueChange={v => {
								setPlanID(Number(v));
							}}
						>
							<ComboboxInput placeholder="Select plan"></ComboboxInput>
							<ComboboxContent>
								<ComboboxEmpty>No plans found.</ComboboxEmpty>
								<ComboboxList>
									{item => (
										<ComboboxItem key={item.value} value={item.value}>
											{item.label}
										</ComboboxItem>
									)}
								</ComboboxList>
							</ComboboxContent>
						</Combobox>
					</FormField>
					<FormField id="status" label="Status" errors={state?.errors?.properties?.planId?.errors}>
						<Select
							name="status"
							id="status"
							value={status}
							onChange={event => setStatus(event.target.value as PaymentStatus)}
						>
							<option value=""></option>
							<option value={PaymentStatus.CANCELLED}>{PaymentStatus.CANCELLED}</option>
							<option value={PaymentStatus.PENDING}>{PaymentStatus.PENDING}</option>
							<option value={PaymentStatus.SUCCEEDED}>{PaymentStatus.SUCCEEDED}</option>
						</Select>
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
