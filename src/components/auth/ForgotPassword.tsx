
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { Mail, ArrowLeft } from "lucide-react";

interface ForgotPasswordProps {
  onBack: () => void;
}

const emailSchema = z.string().email("Please enter a valid email address");

export const ForgotPassword = ({ onBack }: ForgotPasswordProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      // Validate email
      emailSchema.parse(email);
      
      setIsLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      
      if (error) throw error;
      
      setIsSent(true);
      toast.success("Reset password link sent to your email");
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
        toast.error("Failed to send reset link");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="space-y-6 text-center">
        <Mail className="mx-auto h-12 w-12 text-mint-500" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Check your email</h3>
          <p className="text-sm text-muted-foreground">
            We've sent a password reset link to {email}
          </p>
        </div>
        <Button
          className="w-full"
          variant="outline"
          onClick={onBack}
        >
          Back to login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Button
          variant="ghost"
          className="p-0 h-auto text-mint-600"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to login
        </Button>
        <h3 className="text-xl font-semibold">Reset your password</h3>
        <p className="text-sm text-muted-foreground">
          Enter your email and we'll send you a link to reset your password
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        
        <Button
          className="w-full bg-mint-600 hover:bg-mint-700"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send reset link"}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
