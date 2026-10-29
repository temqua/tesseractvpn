'use client';
import { Button } from '@/app/components/button';
import { Calendar } from '@/app/components/calendar';
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from '@/app/components/combobox';
import ContentArea from '@/app/components/content-area';
import { FieldSet } from '@/app/components/field';
import FormField from '@/app/components/form-field';
import { Input } from '@/app/components/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/popover';
import { Select } from '@/app/components/select';
import { createAction } from '@/app/lib/actions/payments';
import { PaymentStatus } from '@/app/lib/enums';
import { formatISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useActionState, useState } from 'react';
import { PaymentFormState } from '../lib/definitions';

export default function NewPaymentClientSide({
	users,
	plans,
}: {
	users: {
		label: string;
		value: string;
	}[];
	plans: {
		label: string;
		value: string;
	}[];
}) {
	const [state, formAction, isPendingUpdate] = useActionState<PaymentFormState, FormData>(createAction, {});

	const [amount, setAmount] = useState(0);
	const [monthsCount, setMonthsCount] = useState(0);
	const [expiresOn, setExpiresOn] = useState('');
	const [userId, setUserID] = useState<number | null>(null);
	const [planId, setPlanID] = useState<number | null>(null);
	const [expiresOnDate, setExpiresOnDate] = useState(new Date());
	const [isExpiresOnOpened, setExpiresOnOpened] = useState(false);
	const [status, setStatus] = useState(PaymentStatus.PENDING);
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
							step="0.01"
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
					<FormField
						id="expiresOn"
						label="Expires on"
						errors={state?.errors?.properties?.expiresOn?.errors}
					>
						{/* <Input
							value={expiresOn}
							onChange={event => setExpiresOn(event.target.value)}
							id="expiresOn"
							name="expiresOn"
							autoComplete="off"
							placeholder="Expires On"
							aria-invalid={Boolean(state?.errors?.properties?.expiresOn?.errors?.length)}
						/> */}
						<input type="hidden" name="expiresOn" value={expiresOn} />
						<Popover open={isExpiresOnOpened} onOpenChange={setExpiresOnOpened}>
							<PopoverTrigger
								render={
									<Button variant="outline" id="date" className="justify-start w-full">
										<CalendarIcon data-icon="inline-start" />
										{expiresOn ? expiresOn : <span>Select date</span>}
									</Button>
								}
							/>
							<PopoverContent
								className="w-auto overflow-hidden p-0"
								align="start"
								alignOffset={-8}
								sideOffset={10}
							>
								<Calendar
									mode="single"
									captionLayout="dropdown"
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
					</FormField>
					<FormField id="userId" label="User" errors={state?.errors?.properties?.userId?.errors}>
						<Combobox
							items={users}
							name="userId"
							value={userId ?? undefined}
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
							items={plans}
							name="planId"
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
					<Button type="submit">Submit</Button>
					{state?.errors?.errors?.length ? state?.errors?.errors.join(',') : ''}
					{state?.data?.id ? `Successfully created payment ${state?.data.id}` : ''}
				</FieldSet>
			</form>
		</ContentArea>
	);
}
