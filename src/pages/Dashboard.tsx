
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SearchIcon, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface LenderOffer {
  id: string;
  userName: string;
  contact: string;
  amount: number;
  paymentMethod: string;
}

const mockOffers: LenderOffer[] = [
  {
    id: "1",
    userName: "John Doe",
    contact: "+266 5555 1234",
    amount: 3000,
    paymentMethod: "M-Pesa",
  },
  {
    id: "2",
    userName: "Jane Smith",
    contact: "+266 5555 5678",
    amount: 5000,
    paymentMethod: "Bank Transfer",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [offers] = useState<LenderOffer[]>(mockOffers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const { user, signOut } = useAuth();

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch = offer.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.contact.includes(searchTerm);
    const matchesPaymentMethod = !selectedPaymentMethod || offer.paymentMethod === selectedPaymentMethod;
    return matchesSearch && matchesPaymentMethod;
  });

  const uniquePaymentMethods = Array.from(new Set(offers.map(offer => offer.paymentMethod)));

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-50 to-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Available Lenders</h1>
            <p className="text-muted-foreground mt-1">Find trusted lenders in your area</p>
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

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge
              variant="outline"
              className={`cursor-pointer ${!selectedPaymentMethod ? 'bg-mint-100 text-mint-800' : ''}`}
              onClick={() => setSelectedPaymentMethod(null)}
            >
              All Methods
            </Badge>
            {uniquePaymentMethods.map((method) => (
              <Badge
                key={method}
                variant="outline"
                className={`cursor-pointer ${selectedPaymentMethod === method ? 'bg-mint-100 text-mint-800' : ''}`}
                onClick={() => setSelectedPaymentMethod(method)}
              >
                {method}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          {filteredOffers.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              No lenders found matching your criteria
            </Card>
          ) : (
            filteredOffers.map((offer) => (
              <Card
                key={offer.id}
                className="p-6 card-hover transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-xl font-medium">{offer.userName}</h3>
                      <p className="text-sm text-muted-foreground">{offer.contact}</p>
                    </div>
                    <Badge variant="secondary" className="bg-mint-100 text-mint-800">
                      {offer.paymentMethod}
                    </Badge>
                  </div>
                  <div className="w-full sm:w-auto text-left sm:text-right space-y-3">
                    <div>
                      <p className="text-2xl font-semibold text-mint-600">
                        M{offer.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Available to lend</p>
                    </div>
                    <Button className="w-full sm:w-auto bg-mint-500 hover:bg-mint-600 button-hover">
                      Borrow
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
