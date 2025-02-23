
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Mail, Lock } from "lucide-react";
import { SignupFields } from "@/components/auth/SignupFields";
import { VerificationMethodSelector } from "@/components/auth/VerificationMethod";
import { validateAuthForm } from "@/utils/authValidation";
import { FormData, VerificationMethod } from "@/types/auth";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    contact: "",
    accountNumber: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateAuthForm(formData, isSignUp);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      toast({
        title: "Error",
        description: "Please check all required fields",
        variant: "destructive",
      });
      return;
    }

    if (isSignUp && !verificationMethod) {
      toast({
        title: "Error",
        description: "Please select a verification method",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: isSignUp ? "Account Created" : "Welcome Back",
      description: isSignUp ? "Your account has been created successfully!" : "You have been logged in successfully!",
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-mint-50 to-white px-4">
      <Card className="w-full max-w-md p-8 space-y-6 animate-fadeIn">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSignUp
              ? "Enter your details to create your account"
              : "Enter your details to sign in"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <SignupFields
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
            />
          )}
          
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="pl-9"
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email}</p>
            )}
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="pl-9"
            />
            {errors.password && (
              <p className="text-sm text-destructive mt-1">{errors.password}</p>
            )}
          </div>

          {isSignUp && (
            <VerificationMethodSelector
              verificationMethod={verificationMethod}
              setVerificationMethod={setVerificationMethod}
            />
          )}

          <Button 
            type="submit" 
            className="w-full button-hover bg-mint-500 hover:bg-mint-600"
          >
            {isSignUp ? (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setVerificationMethod(null);
              setFormData({
                fullName: "",
                email: "",
                password: "",
                contact: "",
                accountNumber: "",
              });
              setErrors({});
            }}
            className="text-sm text-mint-600 hover:text-mint-700 transition-colors"
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
