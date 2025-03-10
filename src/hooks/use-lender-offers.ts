
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LenderOffer, CreateLenderOfferFormData } from "@/types/lender";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export async function fetchLenderOffers(): Promise<LenderOffer[]> {
  const { data, error } = await supabase
    .from("lender_offers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching lender offers:", error);
    toast.error("Failed to load lender offers");
    throw error;
  }

  return data || [];
}

export function useLenderOffers() {
  return useQuery({
    queryKey: ["lenderOffers"],
    queryFn: fetchLenderOffers,
    refetchOnWindowFocus: false,
  });
}

export function useCreateLenderOffer() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (formData: CreateLenderOfferFormData) => {
      if (!user) {
        throw new Error("You must be logged in to create a lender offer");
      }
      
      const newOffer = {
        user_id: user.id,
        ...formData
      };
      
      const { data, error } = await supabase
        .from("lender_offers")
        .insert(newOffer)
        .select()
        .single();
        
      if (error) {
        console.error("Error creating lender offer:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lenderOffers"] });
      toast.success("Lender offer created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create offer: ${error.message}`);
    }
  });
}
