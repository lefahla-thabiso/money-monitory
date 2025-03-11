
import { supabase } from "@/integrations/supabase/client";
import { LoanWithDetails } from "@/types/loans";
import { toast } from "sonner";

export async function fetchActiveLoansByBorrowerId(borrowerId: string): Promise<LoanWithDetails[]> {
  const { data, error } = await supabase
    .from("active_loans")
    .select(`
      *,
      offer: lender_offers (
        full_name,
        contact,
        amount,
        payment_method,
        interest_rate
      )
    `)
    .eq('borrower_id', borrowerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching active loans:", error);
    toast.error("Failed to load your active loans");
    throw error;
  }

  return (data || []) as LoanWithDetails[];
}

export async function fetchActiveLoansByLenderId(lenderId: string): Promise<LoanWithDetails[]> {
  const { data, error } = await supabase
    .from("active_loans")
    .select(`
      *,
      offer: lender_offers (
        full_name,
        contact,
        amount,
        payment_method,
        interest_rate
      )
    `)
    .eq('lender_id', lenderId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching lender's active loans:", error);
    toast.error("Failed to load loans for your offers");
    throw error;
  }

  return (data || []) as LoanWithDetails[];
}
