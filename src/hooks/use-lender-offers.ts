
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LenderOffer, CreateLenderOfferFormData } from "@/types/lender";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export async function fetchLenderOffers(excludeUserId?: string): Promise<LenderOffer[]> {
  let query = supabase
    .from("lender_offers")
    .select("*")
    .order("created_at", { ascending: false });
  
  // If excludeUserId is provided, filter out offers from that user
  if (excludeUserId) {
    query = query.neq('user_id', excludeUserId);
  }
  
  const { data, error } = await query;

  if (error) {
    console.error("Error fetching lender offers:", error);
    toast.error("Failed to load lender offers");
    throw error;
  }

  return data || [];
}

export async function fetchUserLenderOffers(userId: string): Promise<LenderOffer[]> {
  const { data, error } = await supabase
    .from("lender_offers")
    .select("*")
    .eq('user_id', userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user lender offers:", error);
    toast.error("Failed to load your lending offers");
    throw error;
  }

  return data || [];
}

export function useLenderOffers(excludeCurrentUser: boolean = false) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["lenderOffers", excludeCurrentUser, user?.id],
    queryFn: () => fetchLenderOffers(excludeCurrentUser ? user?.id : undefined),
    refetchOnWindowFocus: false,
    enabled: excludeCurrentUser ? !!user : true,
  });
}

export function useUserLenderOffers() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["userLenderOffers", user?.id],
    queryFn: () => user ? fetchUserLenderOffers(user.id) : Promise.resolve([]),
    refetchOnWindowFocus: false,
    enabled: !!user,
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
      queryClient.invalidateQueries({ queryKey: ["userLenderOffers"] });
      toast.success("Lender offer created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create offer: ${error.message}`);
    }
  });
}
