
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LenderOffer } from "@/types/lender";
import { toast } from "sonner";

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
