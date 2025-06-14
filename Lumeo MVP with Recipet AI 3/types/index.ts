export interface Purchase {
  id: string;
  date: string;
  paymentMethod: string;
  category: string;
  items: string[];
  price: number;
}

export type PaymentMethod = 'Cash' | 'Credit Card' | 'Debit Card' | 'Mobile Payment';
export type Category = 'Food' | 'Transportation' | 'Entertainment' | 'Shopping' | 'Bills' | 'Other'; 