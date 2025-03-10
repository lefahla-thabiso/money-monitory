
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const Header = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className="bg-white shadow-sm py-4 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Wallet className="h-8 w-8 text-mint-600 mr-2" />
            <h1 className="text-xl font-semibold text-gray-900">Lefahla</h1>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate("/lendings")}
              variant="outline"
              className="button-hover"
            >
              My Lendings
            </Button>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="button-hover"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
