
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Mail, Lock } from "lucide-react";
import { SignupFields } from "@/components/auth/SignupFields";
import { VerificationMethodSelector } from "@/components/auth/VerificationMethod";
import { ForgotPassword } from "@/components/auth/ForgotPassword";
import { validateAuthForm } from "@/utils/authValidation";
import { FormData, VerificationMethod } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    contact: "",
    accountNumber: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  // Redirect if already logged in
  if (user) {
    navigate("/dashboard");
    return null;
  }

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

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              fullName: formData.fullName,
              contact: formData.contact,
              accountNumber: formData.accountNumber,
              // Store security questions and answers in metadata
              security_question1: formData.securityQuestion1,
              security_answer1: formData.securityAnswer1,
              security_question2: formData.securityQuestion2,
              security_answer2: formData.securityAnswer2
            }
          }
        });

        if (error) throw error;

        toast({
          title: "Account Created",
          description: "Your account has been created successfully! Please check your email to confirm your account.",
        });
        
      } else {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        toast({
          title: "Welcome Back",
          description: "You have been logged in successfully!",
        });
        
        // Get the redirect path or default to dashboard
        const from = (location.state as any)?.from?.pathname || "/dashboard";
        navigate(from);
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-mint-50 to-white px-4">
        <Card className="w-full max-w-md p-8 space-y-6 animate-fadeIn">
          <ForgotPassword onBack={() => setIsForgotPassword(false)} />
        </Card>
      </div>
    );
  }

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
              handleSelectChange={handleSelectChange}
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
              disabled={isLoading}
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
              disabled={isLoading}
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

          {!isSignUp && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-sm text-mint-600 hover:text-mint-700 transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full button-hover bg-mint-500 hover:bg-mint-600"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : isSignUp ? (
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
            disabled={isLoading}
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
