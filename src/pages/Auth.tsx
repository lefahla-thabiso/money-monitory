
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Mail, Lock, User, CreditCard } from "lucide-react";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  contact: string;
  accountNumber: string;
}

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<"email" | "phone" | null>(null);
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

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (isSignUp) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      }
      if (!formData.contact.trim()) {
        newErrors.contact = "Contact number is required";
      }
      if (!formData.accountNumber.trim()) {
        newErrors.accountNumber = "Account number is required";
      } else if (!/^\d{10,}$/.test(formData.accountNumber)) {
        newErrors.accountNumber = "Account number must be at least 10 digits";
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
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

    // Add authentication logic here
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
