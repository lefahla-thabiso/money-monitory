
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveLoansByBorrower, useUpdateLoanPayment } from "@/hooks/use-active-loans";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const ActiveLoans = () => {
  const navigate = useNavigate();
  const { data: loans, isLoading } = useActiveLoansByBorrower();
  const { mutate: updatePayment, isPending: isUpdatingPayment } = useUpdateLoanPayment();
  
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [paymentProof, setPaymentProof] = useState<string>("");

  const handleLoanClick = (loanId: string) => {
    setSelectedLoan(loanId);
    setOpen(true);
  };

  const handlePaymentSubmit = () => {
    if (!selectedLoan) return;
    
    updatePayment({
      loanId: selectedLoan,
      paymentProof
    }, {
      onSuccess: () => {
        setOpen(false);
        setPaymentProof("");
        setSelectedLoan(null);
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Payment Pending</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Payment Sent</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Payment Confirmed</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-50 to-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate("/dashboard")}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-semibold">My Active Loans</h1>
        </div>

        {isLoading ? (
          <div className="grid gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-3 w-full sm:w-2/3">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-36" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <div className="w-full sm:w-1/3 text-right space-y-3">
                    <Skeleton className="h-8 w-32 ml-auto" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : loans && loans.length > 0 ? (
          <div className="grid gap-6">
            {loans.map((loan) => (
              <Card
                key={loan.id}
                className={`p-6 ${loan.status !== 'confirmed' ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
                onClick={() => loan.status !== 'confirmed' && handleLoanClick(loan.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-xl font-medium">{loan.offer.full_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {loan.offer.contact} • {loan.offer.payment_method}
                      </p>
                    </div>
                    <div className="space-x-2">
                      {getStatusBadge(loan.status)}
                      {loan.offer.interest_rate && (
                        <Badge variant="outline" className="bg-amber-100 text-amber-800">
                          {loan.offer.interest_rate}% interest
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-mint-600">
                      M{loan.offer.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Borrowed on {new Date(loan.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center text-muted-foreground">
            You don't have any active loans
          </Card>
        )}
      </div>

      {/* Loan Details Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              {selectedLoan && loans?.find(loan => loan.id === selectedLoan)?.status === 'pending' 
                ? "Complete your payment and upload proof below" 
                : "Your payment is being processed"}
            </DialogDescription>
          </DialogHeader>
          
          {selectedLoan && loans && (
            <div className="space-y-4 py-4">
              {(() => {
                const loan = loans.find(l => l.id === selectedLoan);
                if (!loan) return null;
                
                return (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Lender</p>
                        <p className="text-sm text-muted-foreground">{loan.offer.full_name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Amount</p>
                        <p className="text-sm text-muted-foreground">M{loan.offer.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Payment Method</p>
                        <p className="text-sm text-muted-foreground">{loan.offer.payment_method}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Contact</p>
                        <p className="text-sm text-muted-foreground">{loan.offer.contact}</p>
                      </div>
                    </div>
                    
                    {loan.status === 'pending' && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Payment Proof</p>
                        <Input
                          placeholder="Paste transaction ID or reference number"
                          value={paymentProof}
                          onChange={(e) => setPaymentProof(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Please make a payment via {loan.offer.payment_method} to {loan.offer.contact} and enter the transaction details above
                        </p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            {selectedLoan && loans?.find(loan => loan.id === selectedLoan)?.status === 'pending' && (
              <Button 
                type="button"
                className="bg-mint-500 hover:bg-mint-600"
                onClick={handlePaymentSubmit}
                disabled={isUpdatingPayment || !paymentProof.trim()}
              >
                {isUpdatingPayment ? "Submitting..." : "I've Paid"}
                <Upload className="ml-2 h-4 w-4" />
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActiveLoans;
