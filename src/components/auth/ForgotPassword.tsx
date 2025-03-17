
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { Mail, ArrowLeft, Shield, Check } from "lucide-react";
import { SecurityAnswers, PasswordRecoveryState } from "@/types/auth";
import { Card } from "@/components/ui/card";

interface ForgotPasswordProps {
  onBack: () => void;
}

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

export const ForgotPassword = ({ onBack }: ForgotPasswordProps) => {
  const [email, setEmail] = useState("");
  const [securityState, setSecurityState] = useState<PasswordRecoveryState>({
    step: 'questions',
    email: '',
    isVerified: false
  });
  const [securityAnswers, setSecurityAnswers] = useState<Partial<SecurityAnswers>>({});
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      // Validate email
      emailSchema.parse(email);
      
      setIsLoading(true);
      
      // First check if the user exists in auth.users
      const { data: authUser, error: authError } = await supabase.auth
        .getUser(email);
        
      if (authError) {
        console.log("Auth check error:", authError);
      }
      
      // Then fetch user's security questions from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();
      
      console.log("Profile lookup result:", { data, error });
        
      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error("No account found for this email");
        }
        throw error;
      }
      
      // Check if user has security questions set
      if (!data.security_question1 || !data.security_question2) {
        throw new Error("Security questions have not been set up for this account");
      }
      
      setSecurityAnswers({
        email: email,
        question1: data.security_question1,
        question2: data.security_question2
      });
      
      setSecurityState({
        step: 'questions',
        email: email,
        isVerified: false
      });
      
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
        toast.error("Unable to find account");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecurityAnswers = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!securityAnswers.answer1 || !securityAnswers.answer2) {
      setError("Please answer both security questions");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Verify security answers from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();
        
      if (error) throw error;
      
      // Case insensitive comparison
      const answer1Correct = data.security_answer1?.toLowerCase() === securityAnswers.answer1?.toLowerCase();
      const answer2Correct = data.security_answer2?.toLowerCase() === securityAnswers.answer2?.toLowerCase();
      
      if (answer1Correct && answer2Correct) {
        setSecurityState({
          ...securityState,
          step: 'newPassword',
          isVerified: true
        });
      } else {
        throw new Error("Security answers are incorrect");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error("Security answers verification failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      // Validate passwords
      passwordSchema.parse(newPassword);
      
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      
      setIsLoading(true);
      
      // Get user id for the email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
        
      if (userError) throw userError;
      
      // Update password directly
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      setSuccess(true);
      toast.success("Password has been reset successfully");
      
      // Sign in the user automatically after password reset
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: newPassword
      });
      
      if (signInError) {
        console.error("Auto sign-in failed:", signInError);
      }
      
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
        toast.error("Password reset failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <Check className="mx-auto h-12 w-12 text-mint-500" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Password Reset Complete</h3>
          <p className="text-sm text-muted-foreground">
            Your password has been reset successfully. You are now signed in.
          </p>
        </div>
      </div>
    );
  }

  if (securityState.step === 'questions' && securityAnswers.question1 && securityAnswers.question2) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="p-0 h-auto text-mint-600"
            onClick={() => setSecurityAnswers({})}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to email
          </Button>
          <h3 className="text-xl font-semibold">Security Verification</h3>
          <p className="text-sm text-muted-foreground">
            Please answer your security questions to reset your password
          </p>
        </div>
        
        <form onSubmit={handleSecurityAnswers} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question1">Question 1: {securityAnswers.question1}</Label>
            <Input
              id="answer1"
              placeholder="Your answer"
              value={securityAnswers.answer1 || ''}
              onChange={(e) => setSecurityAnswers({...securityAnswers, answer1: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="question2">Question 2: {securityAnswers.question2}</Label>
            <Input
              id="answer2"
              placeholder="Your answer"
              value={securityAnswers.answer2 || ''}
              onChange={(e) => setSecurityAnswers({...securityAnswers, answer2: e.target.value})}
              required
            />
          </div>
          
          {error && <p className="text-sm text-red-500">{error}</p>}
          
          <Button
            className="w-full bg-mint-600 hover:bg-mint-700"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Answers"}
          </Button>
        </form>
      </div>
    );
  }

  if (securityState.step === 'newPassword') {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Reset Your Password</h3>
          <p className="text-sm text-muted-foreground">
            Create a new password for your account
          </p>
        </div>
        
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <p className="text-sm text-red-500">{error}</p>}
          
          <Button
            className="w-full bg-mint-600 hover:bg-mint-700"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
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
          Enter your email to begin the password recovery process
        </p>
      </div>
      
      <form onSubmit={handleEmailSubmit} className="space-y-4">
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
          {isLoading ? "Processing..." : "Continue"}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
