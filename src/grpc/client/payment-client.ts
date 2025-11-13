import { paymentClient } from '../connection';

interface UserWalletResponse {
  balance: string;
  transactions: number;
}

export async function fetchUserWalletBalanceAndTransactions(userId: string) {
  return new Promise<UserWalletResponse>((resolve, reject) => {
    paymentClient.GetUserWalletBalanceAndTransactions(
      { userId },
      (err: Error | null, response: UserWalletResponse) => {
        if (err) return reject(err);
        resolve(response);
      }
    );
  });
}
