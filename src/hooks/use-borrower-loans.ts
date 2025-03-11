
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { fetchActiveLoansByBorrowerId } from "@/api/active-loans";

export function useActiveLoansByBorrower() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["activeLoansBorrower", user?.id],
    queryFn: () => user ? fetchActiveLoansByBorrowerId(user.id) : Promise.resolve([]),
    refetchOnWindowFocus: false,
    enabled: !!user,
  });
}
