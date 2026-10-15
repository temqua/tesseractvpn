export interface SearchPaymentDto {
  userId?: string;
  from?: string;
  to?: string;
  sheet?: string;
}
export interface IChildResult {
  id: number;
  username: string;
  created?: boolean;
  activated?: boolean;
  renewed?: boolean;
}
