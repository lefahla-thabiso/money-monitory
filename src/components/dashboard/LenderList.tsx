
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LenderOffer } from "@/types/lender";
import { toast } from "sonner";

interface LenderListProps {
  isLoading: boolean;
  filteredOffers: LenderOffer[];
}

export const LenderList = ({ isLoading, filteredOffers }: LenderListProps) => {
  const handleBorrow = (offer: LenderOffer) => {
    toast.success(`Borrow request sent to ${offer.full_name}`);
    // This would typically trigger a request to the backend
  };

  if (isLoading) {
    return (
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
              <div className="w-full sm:w-1/3 text-left sm:text-right space-y-3">
                <Skeleton className="h-8 w-32 ml-auto" />
                <Skeleton className="h-9 w-full sm:w-32 ml-auto" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredOffers.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        No lenders found matching your criteria
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {filteredOffers.map((offer) => (
        <Card
          key={offer.id}
          className="p-6 card-hover transition-all duration-300"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <h3 className="text-xl font-medium">{offer.full_name}</h3>
                <p className="text-sm text-muted-foreground">{offer.contact}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-mint-100 text-mint-800">
                  {offer.payment_method}
                </Badge>
                {offer.interest_rate && (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800">
                    {offer.interest_rate}% interest
                  </Badge>
                )}
              </div>
            </div>
            <div className="w-full sm:w-auto text-left sm:text-right space-y-3">
              <div>
                <p className="text-2xl font-semibold text-mint-600">
                  M{offer.amount.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Available to lend</p>
              </div>
              <Button 
                className="w-full sm:w-auto bg-mint-500 hover:bg-mint-600 button-hover"
                onClick={() => handleBorrow(offer)}
              >
                Borrow
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
