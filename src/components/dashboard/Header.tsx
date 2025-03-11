
import { Button } from "@/components/ui/button";
import { LogOut, CreditCard, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useActiveLoansByBorrower, useActiveLoansByLender } from "@/hooks/use-active-loans";

export const Header = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { data: borrowerLoans } = useActiveLoansByBorrower();
  const { data: lenderLoans } = useActiveLoansByLender();
  
  // Count notifications for borrower (any active loans)
  const activeLoanCount = borrowerLoans?.length || 0;
  
  // Count notifications for lender (loans with paid status that need confirmation)
  const pendingConfirmations = lenderLoans?.filter(loan => loan.status === 'paid').length || 0;

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className="bg-white shadow-sm py-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <span className="text-lg font-semibold text-mint-600">Nkunzi Finance</span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="relative"
            onClick={() => navigate("/active-loans")}
          >
            <CreditCard className="h-5 w-5 mr-1 text-mint-600" />
            <span>My Loans</span>
            {activeLoanCount > 0 && (
              <span className="absolute -top-1 -right-1 rounded-full bg-mint-500 text-white text-xs w-5 h-5 flex items-center justify-center">
                {activeLoanCount}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            className="relative"
            onClick={() => navigate("/lendings")}
          >
            <Wallet className="h-5 w-5 mr-1 text-mint-600" />
            <span>My Lendings</span>
            {pendingConfirmations > 0 && (
              <span className="absolute -top-1 -right-1 rounded-full bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center">
                {pendingConfirmations}
              </span>
            )}
          </Button>
          <Button
            variant="outline"
            className="button-hover"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};
