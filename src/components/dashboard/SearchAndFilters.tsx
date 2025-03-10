
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchIcon, RefreshCcw } from "lucide-react";

interface SearchAndFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedPaymentMethod: string | null;
  setSelectedPaymentMethod: (method: string | null) => void;
  uniquePaymentMethods: string[];
  onRefresh: () => void;
}

export const SearchAndFilters = ({
  searchTerm,
  setSearchTerm,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  uniquePaymentMethods,
  onRefresh,
}: SearchAndFiltersProps) => {
  return (
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
          onClick={onRefresh}
          className="ml-auto"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  );
};
