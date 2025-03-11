
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useUpdateLoanPayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      loanId, 
      paymentProof, 
      paymentFile 
    }: { 
      loanId: string, 
      paymentProof?: string, 
      paymentFile?: File 
    }) => {
      let fileUrl = null;
      
      // Upload file if provided
      if (paymentFile) {
        const fileName = `payment_proof_${loanId}_${Date.now()}`;
        const fileExt = paymentFile.name.split('.').pop();
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment_proofs')
          .upload(`${fileName}.${fileExt}`, paymentFile);
          
        if (uploadError) {
          console.error("Error uploading payment proof file:", uploadError);
          throw uploadError;
        }
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('payment_proofs')
          .getPublicUrl(uploadData.path);
          
        fileUrl = publicUrlData.publicUrl;
      }
      
      const updates = {
        status: 'paid',
        payment_proof: paymentProof || null,
        payment_file: fileUrl || null,
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
