
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  SearchIcon, 
  LogOut, 
  Wallet, 
  BarChart3, 
  ArrowRight, 
  RefreshCcw,
  PlusCircle,
  X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLenderOffers } from "@/hooks/use-lender-offers";
import { LenderOffer } from "@/types/lender";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateLenderOfferForm } from "@/components/CreateLenderOfferForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: offers, isLoading, error, refetch } = useLenderOffers();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Handle any errors with data fetching
  if (error) {
    console.error("Error loading lender offers:", error);
  }

  const filteredOffers = offers?.filter((offer) => {
    const matchesSearch = 
      offer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.contact?.includes(searchTerm);
    const matchesPaymentMethod = !selectedPaymentMethod || offer.payment_method === selectedPaymentMethod;
    return matchesSearch && matchesPaymentMethod;
  }) || [];

  const uniquePaymentMethods = Array.from(
    new Set(offers?.map(offer => offer.payment_method) || [])
  );

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Refreshed lender offers");
  };

  const handleBorrow = (offer: LenderOffer) => {
    toast.success(`Borrow request sent to ${offer.full_name}`);
    // This would typically trigger a request to the backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-50 to-white">
      {/* Header Section */}
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
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900">Available Lenders</h2>
            <p className="text-muted-foreground mt-1">Find trusted lenders in your area</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-mint-500 hover:bg-mint-600">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Offer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <CreateLenderOfferForm />
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Stats Section */}
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

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
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
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleRefresh}
              className="ml-auto"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Lender List */}
        <div className="grid gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, i) => (
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
            ))
          ) : filteredOffers.length === 0 ? (
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
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
