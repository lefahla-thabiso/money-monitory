import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const useLenderLoansWithNotifications = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['lender-loans-with-notifications', user?.id],
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
        .eq('lender_id', user.id)
        .order('updated_at', { ascending: false });
        
      if (error) throw error;
      
      // Count new notifications (loans with status 'paid' that haven't been confirmed)
      const notificationCount = data.filter(loan => loan.status === 'paid').length;
      
      return {
        loans: data,
        notificationCount
      };
    },
    enabled: !!user,
  });
};

export const useConfirmLoanPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (loanId: string) => {
      const { data, error } = await supabase
        .from('active_loans')
        .update({
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', loanId)
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lender-loans-with-notifications'] });
      toast.success("Payment confirmed successfully");
    },
    onError: (error) => {
      toast.error("Failed to confirm payment: " + (error as Error).message);
    }
  });
};
