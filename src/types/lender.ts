
export interface LenderOffer {
  id: string;
  user_id: string;
  full_name: string;
  contact: string;
  amount: number;
  payment_method: string;
  interest_rate?: number;
  created_at: string;
}

export interface CreateLenderOfferFormData {
  full_name: string;
  contact: string;
  amount: number;
  payment_method: string;
  interest_rate?: number;
}
