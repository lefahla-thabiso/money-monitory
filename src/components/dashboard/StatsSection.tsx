
import { Card } from "@/components/ui/card";
import { BarChart3, Wallet, ArrowRight } from "lucide-react";
import { LenderOffer } from "@/types/lender";

interface StatsSectionProps {
  offers: LenderOffer[] | undefined;
  uniquePaymentMethods: string[];
}

export const StatsSection = ({ offers, uniquePaymentMethods }: StatsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Total Lenders</p>
            <h3 className="text-2xl font-semibold">{offers?.length || 0}</h3>
          </div>
          <BarChart3 className="h-8 w-8 text-mint-500" />
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Payment Methods</p>
            <h3 className="text-2xl font-semibold">{uniquePaymentMethods.length}</h3>
          </div>
          <Wallet className="h-8 w-8 text-mint-500" />
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">My Active Loans</p>
            <h3 className="text-2xl font-semibold">0</h3>
          </div>
          <ArrowRight className="h-8 w-8 text-mint-500" />
        </div>
      </Card>
    </div>
  );
};
