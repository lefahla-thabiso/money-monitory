
export interface ActiveLoan {
  id: string;
  lender_offer_id: string;
  borrower_id: string;
  lender_id: string;
  status: 'pending' | 'paid' | 'confirmed' | string; // Adding string to handle any other status
  created_at: string;
  updated_at: string;
  payment_proof?: string;
}

export interface LoanWithDetails extends ActiveLoan {
  offer: {
    full_name: string;
    contact: string;
    amount: number;
    payment_method: string;
    interest_rate?: number;
  };
}
