
import { useState } from "react";
import { useCreateLenderOffer } from "@/hooks/use-lender-offers";
import { CreateLenderOfferFormData } from "@/types/lender";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Define payment methods
const paymentMethods = ["M-Pesa", "Bank Transfer", "Cash", "EcoCash", "Orange Money"];

// Update props to include both onDismiss and onSuccess for flexibility
interface CreateLenderOfferFormProps {
  onDismiss?: () => void;
  onSuccess?: () => void;
}

export function CreateLenderOfferForm({ onDismiss, onSuccess }: CreateLenderOfferFormProps) {
  const { user } = useAuth();
  const { mutate, isPending } = useCreateLenderOffer();
  
  const [formData, setFormData] = useState<CreateLenderOfferFormData>({
    full_name: "",
    contact: "",
    amount: 0,
    payment_method: "M-Pesa",
    interest_rate: 5,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" || name === "interest_rate" ? parseFloat(value) : value,
    });
  };
  
  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      payment_method: value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData, {
      onSuccess: () => {
        if (onSuccess) {
          onSuccess();
        }
        if (onDismiss) {
          onDismiss();
        }
      }
    });
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl text-center">Create Lender Offer</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Your Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              placeholder="Enter your full name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contact">Contact Number</Label>
            <Input
              id="contact"
              name="contact"
              placeholder="+266 5XXX XXXX"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (M)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min="100"
              step="100"
              placeholder="Enter amount in Maloti"
              value={formData.amount || ""}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="interest_rate">Interest Rate (%)</Label>
            <Input
              id="interest_rate"
              name="interest_rate"
              type="number"
              min="0"
              max="100"
              step="0.5"
              placeholder="Enter interest rate"
              value={formData.interest_rate || ""}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="payment_method">Payment Method</Label>
            <Select
              defaultValue={formData.payment_method}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger id="payment_method" className="w-full">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map(method => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="w-full bg-mint-500 hover:bg-mint-600" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Lender Offer"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
