export interface SearchPaymentDto {
  userId?: string;
  from?: string;
  to?: string;
  sheet?: string;
}
export interface IChildResult {
  userId: number;
  username: string;
  created?: boolean;
  active?: boolean;
  renewed?: boolean;
}
export interface IPaymentProcessResultDto {
  nalog: boolean;
  dependants: IChildResult[];
  notified: boolean;
  renewed: boolean;
  active: boolean;
}
