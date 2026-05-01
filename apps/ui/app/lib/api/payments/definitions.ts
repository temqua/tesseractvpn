export interface IPayment {
    id: string;
    paymentDate: string;
    amount: number;
    currency: string;
    monthsCount: number | null;
    expiresOn: Date | null;
    userId: number;
    parentPaymentId: string | null;
    planId: number | null;
}