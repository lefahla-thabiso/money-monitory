
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Lending {
  id: string;
  lenderName: string;
  amount: number;
  status: "pending" | "active" | "completed";
  paymentMethod: string;
  date: string;
}

const mockLendings: Lending[] = [
  {
    id: "1",
    lenderName: "John Doe",
    amount: 3000,
    status: "active",
    paymentMethod: "M-Pesa",
    date: "2024-02-22",
  },
];

const Lendings = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-50 to-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/dashboard")}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-semibold">My Lendings</h1>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="button-hover"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid gap-6">
          {mockLendings.map((lending) => (
            <Card
              key={lending.id}
              className="p-6 card-hover"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-xl font-medium">{lending.lenderName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Borrowed on {new Date(lending.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Badge
                      variant="secondary"
                      className="bg-mint-100 text-mint-800"
                    >
                      {lending.paymentMethod}
                    </Badge>
                    <Badge
                      className={`
                        ${lending.status === "active" && "bg-green-100 text-green-800"}
                        ${lending.status === "pending" && "bg-yellow-100 text-yellow-800"}
                        ${lending.status === "completed" && "bg-gray-100 text-gray-800"}
                      `}
                    >
                      {lending.status.charAt(0).toUpperCase() + lending.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold text-mint-600">
                    M{lending.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Borrowed amount</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lendings;
