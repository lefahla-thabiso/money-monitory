
import { Input } from "@/components/ui/input";
import { User, CreditCard, Shield } from "lucide-react";
import { FormData, SecurityQuestion } from "@/types/auth";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SignupFieldsProps {
  formData: FormData;
  errors: Partial<FormData>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (field: string, value: string) => void;
}

// Pre-defined security questions
export const securityQuestions: SecurityQuestion[] = [
  { id: 1, question: "What was the name of your first pet?" },
  { id: 2, question: "In what city were you born?" },
  { id: 3, question: "What is your mother's maiden name?" },
  { id: 4, question: "What high school did you attend?" },
  { id: 5, question: "What was the make of your first car?" },
  { id: 6, question: "What is your favorite movie?" },
  { id: 7, question: "What is the name of your favorite childhood teacher?" },
  { id: 8, question: "What is your favorite book?" }
];

export const SignupFields = ({ formData, errors, handleInputChange, handleSelectChange }: SignupFieldsProps) => {
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
      
      {/* Security Questions */}
      <div className="pt-2 border-t">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-medium">Security Questions (for password recovery)</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="security-question-1">Question 1</Label>
            <Select 
              value={formData.securityQuestion1 || ""}
              onValueChange={(value) => handleSelectChange("securityQuestion1", value)}
            >
              <SelectTrigger id="security-question-1" className="w-full">
                <SelectValue placeholder="Select a security question" />
              </SelectTrigger>
              <SelectContent>
                {securityQuestions.slice(0, 4).map(q => (
                  <SelectItem key={q.id} value={q.question}>
                    {q.question}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.securityQuestion1 && (
              <p className="text-sm text-destructive mt-1">{errors.securityQuestion1}</p>
            )}
          </div>
          
          {formData.securityQuestion1 && (
            <div>
              <Label htmlFor="security-answer-1">Answer</Label>
              <Input
                id="security-answer-1"
                type="text"
                name="securityAnswer1"
                placeholder="Your answer"
                value={formData.securityAnswer1 || ''}
                onChange={handleInputChange}
              />
              {errors.securityAnswer1 && (
                <p className="text-sm text-destructive mt-1">{errors.securityAnswer1}</p>
              )}
            </div>
          )}
          
          <div>
            <Label htmlFor="security-question-2">Question 2</Label>
            <Select 
              value={formData.securityQuestion2 || ""}
              onValueChange={(value) => handleSelectChange("securityQuestion2", value)}
            >
              <SelectTrigger id="security-question-2" className="w-full">
                <SelectValue placeholder="Select a security question" />
              </SelectTrigger>
              <SelectContent>
                {securityQuestions.slice(4, 8).map(q => (
                  <SelectItem key={q.id} value={q.question}>
                    {q.question}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.securityQuestion2 && (
              <p className="text-sm text-destructive mt-1">{errors.securityQuestion2}</p>
            )}
          </div>
          
          {formData.securityQuestion2 && (
            <div>
              <Label htmlFor="security-answer-2">Answer</Label>
              <Input
                id="security-answer-2"
                type="text"
                name="securityAnswer2"
                placeholder="Your answer"
                value={formData.securityAnswer2 || ''}
                onChange={handleInputChange}
              />
              {errors.securityAnswer2 && (
                <p className="text-sm text-destructive mt-1">{errors.securityAnswer2}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
