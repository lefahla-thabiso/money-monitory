
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export function useBorrowOffer() {
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
      queryClient.invalidateQueries({ queryKey: ["activeLoansBorrower"] });
      queryClient.invalidateQueries({ queryKey: ["activeLoansLender"] });
      toast.success("Loan request created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to borrow: ${error.message}`);
    }
  });
}
