import { QueryClient } from '@tanstack/react-query';
import { referralTransactionsClient } from '../api/referral-transactions/client';
import { IReferralTransaction } from '../api/referral-transactions/definitions';
import { treeifyError } from 'zod';
import { toast } from '@/app/components/toast';

export async function deleteAction(id: string, queryClient: QueryClient, ...params: (string | number)[]) {
	queryClient.invalidateQueries({ queryKey: ['referral-transactions'] });
	const response = await referralTransactionsClient.delete(id);
	if (response.ok) {
		queryClient.setQueryData(['referral-transactions', ...params], (oldData: IReferralTransaction[]) =>
			oldData.filter(item => item.id !== id),
		);
	}
}

// export function getUpdateAction(id: string) {
//     return async function (state: ExpenseFormState, formData: FormData) {
//         const validatedFields = ExpenseFormSchema.safeParse({
//             amount: Number(formData.get('amount')),
//             category: formData.get('category'),
//             description: formData.get('description'),
//         });
//         if (!validatedFields.success) {
//             return {
//                 errors: treeifyError(validatedFields.error),
//             };
//         }
//         try {
//             const response = await referralTransactionsClient.update(id, {
//                 amount: Number(formData.get('amount')),
//                 category: formData.get('category') as ExpenseCategory,
//                 description: formData.get('description') as string,
//                 paymentDate: formData.get('paymentDate') as string,
//             });
//             if (response.ok) {
//                 toast.success(`Expense ${id} has been successfully updated`);
//             }
//             const data: IErrorBody & IExpense = await response.json();
//             return {
//                 data,
//             };
//         } catch (err) {
//             return {
//                 errors: {
//                     errors: [err instanceof Error ? err.message : String(err)],
//                 },
//             };
//         }
//     };
// }
