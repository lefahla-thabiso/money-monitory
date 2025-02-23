
import { Button } from "@/components/ui/button";
import { Mail, User } from "lucide-react";
import { VerificationMethod } from "@/types/auth";

interface VerificationMethodProps {
  verificationMethod: VerificationMethod;
  setVerificationMethod: (method: VerificationMethod) => void;
}

export const VerificationMethodSelector = ({
  verificationMethod,
  setVerificationMethod,
}: VerificationMethodProps) => {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-center">
        Choose verification method
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant={verificationMethod === "email" ? "default" : "outline"}
          className={`w-full button-hover ${
            verificationMethod === "email" 
              ? "bg-mint-500 hover:bg-mint-600 text-white"
              : ""
          }`}
          onClick={() => setVerificationMethod("email")}
        >
          <Mail className="mr-2 h-4 w-4" />
          Email
        </Button>
        <Button
          type="button"
          variant={verificationMethod === "phone" ? "default" : "outline"}
          className={`w-full button-hover ${
            verificationMethod === "phone"
              ? "bg-mint-500 hover:bg-mint-600 text-white"
              : ""
          }`}
          onClick={() => setVerificationMethod("phone")}
        >
          <User className="mr-2 h-4 w-4" />
          Phone
        </Button>
      </div>
    </div>
  );
};
