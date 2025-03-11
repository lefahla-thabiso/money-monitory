
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
