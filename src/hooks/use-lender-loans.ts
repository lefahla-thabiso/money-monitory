
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { fetchActiveLoansByLenderId } from "@/api/active-loans";

export function useActiveLoansByLender() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["activeLoansLender", user?.id],
    queryFn: () => user ? fetchActiveLoansByLenderId(user.id) : Promise.resolve([]),
    refetchOnWindowFocus: false,
    enabled: !!user,
  });
}
