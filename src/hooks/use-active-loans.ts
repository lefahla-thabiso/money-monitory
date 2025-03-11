
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ActiveLoan, LoanWithDetails } from "@/types/loans";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

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

  return data || [];
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

  return data || [];
}

export function useActiveLoansByBorrower() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["activeLoansBorrower", user?.id],
    queryFn: () => user ? fetchActiveLoansByBorrowerId(user.id) : Promise.resolve([]),
    refetchOnWindowFocus: false,
    enabled: !!user,
  });
}

export function useActiveLoansByLender() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["activeLoansLender", user?.id],
    queryFn: () => user ? fetchActiveLoansByLenderId(user.id) : Promise.resolve([]),
    refetchOnWindowFocus: false,
    enabled: !!user,
  });
}

export function useBorrowOffer() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (offerId: string) => {
      if (!user) {
        throw new Error("You must be logged in to borrow");
      }
      
      // First get the offer to get the lender_id
      const { data: offerData, error: offerError } = await supabase
        .from("lender_offers")
        .select("user_id")
        .eq('id', offerId)
        .single();
        
      if (offerError) {
        throw offerError;
      }
      
      const newLoan = {
        lender_offer_id: offerId,
        borrower_id: user.id,
        lender_id: offerData.user_id,
        status: 'pending'
      };
      
      const { data, error } = await supabase
        .from("active_loans")
        .insert(newLoan)
        .select()
        .single();
        
      if (error) {
        console.error("Error borrowing offer:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lenderOffers"] });
      queryClient.invalidateQueries({ queryKey: ["activeLoansBorrower"] });
      queryClient.invalidateQueries({ queryKey: ["activeLoansLender"] });
      toast.success("Loan request created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to borrow: ${error.message}`);
    }
  });
}

export function useUpdateLoanPayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ loanId, paymentProof }: { loanId: string, paymentProof?: string }) => {
      const updates = {
        status: 'paid',
        payment_proof: paymentProof,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from("active_loans")
        .update(updates)
        .eq('id', loanId)
        .select()
        .single();
        
      if (error) {
        console.error("Error updating loan payment:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeLoansBorrower"] });
      queryClient.invalidateQueries({ queryKey: ["activeLoansLender"] });
      toast.success("Payment marked as complete");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update payment status: ${error.message}`);
    }
  });
}

export function useConfirmLoanPayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (loanId: string) => {
      const updates = {
        status: 'confirmed',
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from("active_loans")
        .update(updates)
        .eq('id', loanId)
        .select()
        .single();
        
      if (error) {
        console.error("Error confirming loan payment:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeLoansBorrower"] });
      queryClient.invalidateQueries({ queryKey: ["activeLoansLender"] });
      toast.success("Payment confirmed successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to confirm payment: ${error.message}`);
    }
  });
}
