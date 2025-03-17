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
