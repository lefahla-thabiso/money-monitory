
import { useState } from "react";
import { toast } from "sonner";
import { useLenderOffers } from "@/hooks/use-lender-offers";
import { LenderOffer } from "@/types/lender";
import { Header } from "@/components/dashboard/Header";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsSection } from "@/components/dashboard/StatsSection";
import { SearchAndFilters } from "@/components/dashboard/SearchAndFilters";
import { LenderList } from "@/components/dashboard/LenderList";

const Dashboard = () => {
  const { data: offers, isLoading, error, refetch } = useLenderOffers();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

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

  const handleRefresh = () => {
    refetch();
    toast.success("Refreshed lender offers");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-50 to-white">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader />
        
        <StatsSection 
          offers={offers} 
          uniquePaymentMethods={uniquePaymentMethods} 
        />

        <SearchAndFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          uniquePaymentMethods={uniquePaymentMethods}
          onRefresh={handleRefresh}
        />

        <LenderList 
          isLoading={isLoading}
          filteredOffers={filteredOffers}
        />
      </main>
    </div>
  );
};

export default Dashboard;
