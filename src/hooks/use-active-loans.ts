
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const useActiveLoansByBorrower = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['active-loans', 'borrower', user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('active_loans')
        .select(`
          *,
          offer:lender_offer_id (
            id, 
            full_name, 
            contact, 
            amount, 
            payment_method, 
            interest_rate
          )
        `)
        .eq('borrower_id', user.id);
        
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

// Add the missing useActiveLoansByLender function
export const useActiveLoansByLender = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['active-loans', 'lender', user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('active_loans')
        .select(`
          *,
          borrower:borrower_id (
            id, 
            full_name, 
            contact, 
            email
          ),
          offer:lender_offer_id (
            id, 
            full_name, 
            amount, 
            payment_method, 
            interest_rate
          )
        `)
        .eq('lender_id', user.id);
        
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

// Add the missing useBorrowOffer function
export const useBorrowOffer = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (offerId: string) => {
      if (!user) {
        throw new Error("You must be logged in to borrow");
      }
      
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
      queryClient.invalidateQueries({ queryKey: ["active-loans"] });
      toast.success("Loan request created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to borrow: ${error.message}`);
    }
  });
};

interface UpdatePaymentParams {
  loanId: string;
  paymentProof?: string;
  fileUrl?: string;
}

export const useUpdateLoanPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ loanId, paymentProof, fileUrl }: UpdatePaymentParams) => {
      // Combine text proof and file URL if both provided
      let proofText = paymentProof || '';
      if (fileUrl) {
        proofText = proofText ? `${proofText} | ${fileUrl}` : fileUrl;
      }
      
      const { data, error } = await supabase
        .from('active_loans')
        .update({
          payment_proof: proofText,
          status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('id', loanId)
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-loans'] });
      toast.success("Payment proof submitted successfully");
    },
    onError: (error) => {
      toast.error("Failed to submit payment: " + (error as Error).message);
    }
  });
};
