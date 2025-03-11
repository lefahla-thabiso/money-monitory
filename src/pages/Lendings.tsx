
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useUserLenderOffers } from "@/hooks/use-lender-offers";
import { Skeleton } from "@/components/ui/skeleton";

const Lendings = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { data: userOffers, isLoading } = useUserLenderOffers();

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

        {isLoading ? (
          <div className="grid gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-3 w-full sm:w-2/3">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-36" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <div className="w-full sm:w-1/3 text-right space-y-3">
                    <Skeleton className="h-8 w-32 ml-auto" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : userOffers && userOffers.length > 0 ? (
          <div className="grid gap-6">
            {userOffers.map((offer) => (
              <Card
                key={offer.id}
                className="p-6 card-hover"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-xl font-medium">{offer.full_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Created on {new Date(offer.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-x-2">
                      <Badge
                        variant="secondary"
                        className="bg-mint-100 text-mint-800"
                      >
                        {offer.payment_method}
                      </Badge>
                      {offer.interest_rate && (
                        <Badge variant="outline" className="bg-amber-100 text-amber-800">
                          {offer.interest_rate}% interest
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-mint-600">
                      M{offer.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Amount offered</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center text-muted-foreground">
            You haven't created any lending offers yet.
          </Card>
        )}
      </div>
    </div>
  );
};

export default Lendings;
