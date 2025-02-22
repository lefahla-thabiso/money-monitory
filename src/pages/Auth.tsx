
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<"email" | "phone" | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add authentication logic here
    toast({
      title: "Success",
      description: "Account created successfully!",
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
              <Input
                type="text"
                placeholder="Full Name"
                className="w-full"
                required
              />
              <Input
                type="tel"
                placeholder="Contact Number"
                className="w-full"
                required
              />
            </div>
          )}
          <Input
            type="email"
            placeholder="Email"
            className="w-full"
            required
          />
          <Input
            type="password"
            placeholder="Password"
            className="w-full"
            required
          />

          {isSignUp && verificationMethod === null && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-center">
                Choose verification method
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full button-hover"
                  onClick={() => setVerificationMethod("email")}
                >
                  Email
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full button-hover"
                  onClick={() => setVerificationMethod("phone")}
                >
                  Phone
                </Button>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full button-hover bg-mint-500 hover:bg-mint-600">
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
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
