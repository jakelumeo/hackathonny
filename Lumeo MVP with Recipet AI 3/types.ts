export type Category = 
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other'
  | 'Lumeo';

export type PaymentMethod = 
  | 'Chase Checking Account'
  | 'Bank of America Checking Account'
  | 'Amex Gold'
  | 'Amex Sky Miles'
  | 'Capital One Savor'
  | 'Business Trading'
  | 'Discover'
  | 'Chase Sapphire Reserve'
  | 'Other';

export interface Purchase {
  id: string;
  date: string;
  paymentMethod: PaymentMethod;
  category: Category;
  items: string[];
  price: number;
  imageUri?: string; // Optional image URI for the purchase
  liked?: boolean;
  comment?: string; // Add comment field
} 