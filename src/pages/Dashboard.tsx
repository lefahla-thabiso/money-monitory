
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-50 to-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Available Lenders</h1>
          <Button
            onClick={() => navigate("/lendings")}
            variant="outline"
            className="button-hover"
          >
            My Lendings
          </Button>
        </div>

        <div className="grid gap-6">
          {offers.map((offer) => (
            <Card
              key={offer.id}
              className="p-6 card-hover"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-xl font-medium">{offer.userName}</h3>
                    <p className="text-sm text-muted-foreground">{offer.contact}</p>
                  </div>
                  <Badge variant="secondary" className="bg-mint-100 text-mint-800">
                    {offer.paymentMethod}
                  </Badge>
                </div>
                <div className="text-right space-y-3">
                  <div>
                    <p className="text-2xl font-semibold text-mint-600">
                      M{offer.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Available to lend</p>
                  </div>
                  <Button className="bg-mint-500 hover:bg-mint-600 button-hover">
                    Borrow
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
