
import { Input } from "@/components/ui/input";
import { User, CreditCard } from "lucide-react";
import { FormData } from "@/types/auth";

interface SignupFieldsProps {
  formData: FormData;
  errors: Partial<FormData>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SignupFields = ({ formData, errors, handleInputChange }: SignupFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleInputChange}
          className="pl-9"
        />
        {errors.fullName && (
          <p className="text-sm text-destructive mt-1">{errors.fullName}</p>
        )}
      </div>
      <div className="relative">
        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="tel"
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleInputChange}
          className="pl-9"
        />
        {errors.contact && (
          <p className="text-sm text-destructive mt-1">{errors.contact}</p>
        )}
      </div>
      <div className="relative">
        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          name="accountNumber"
          placeholder="Account Number"
          value={formData.accountNumber}
          onChange={handleInputChange}
          className="pl-9"
          pattern="\d*"
          minLength={10}
          maxLength={16}
        />
        {errors.accountNumber && (
          <p className="text-sm text-destructive mt-1">{errors.accountNumber}</p>
        )}
      </div>
    </div>
  );
};
