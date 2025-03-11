
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, ArrowLeft, Check, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useUserLenderOffers } from "@/hooks/use-lender-offers";
import { useActiveLoansByLender, useConfirmLoanPayment } from "@/hooks/use-active-loans";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";

const Lendings = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { data: userOffers, isLoading: isOffersLoading } = useUserLenderOffers();
  const { data: activeLoans, isLoading: isLoansLoading } = useActiveLoansByLender();
  const { mutate: confirmPayment, isPending: isConfirming } = useConfirmLoanPayment();
  
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleLoanClick = (loanId: string) => {
    setSelectedLoan(loanId);
    setDialogOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedLoan) return;
    
    confirmPayment(selectedLoan, {
      onSuccess: () => {
        setDialogOpen(false);
        setSelectedLoan(null);
      }
    });
  };

  // Count notifications (loans with paid status that need confirmation)
  const pendingConfirmations = activeLoans?.filter(loan => loan.status === 'paid').length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-50 to-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/dashboard")}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-semibold">My Lendings</h1>
          </div>
          <div className="flex items-center gap-2">
            {pendingConfirmations > 0 && (
              <div className="relative">
                <Bell className="h-5 w-5 text-mint-600" />
                <span className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center">
                  {pendingConfirmations}
                </span>
              </div>
            )}
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="button-hover"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <Tabs defaultValue="offers">
          <TabsList className="mb-4">
            <TabsList.Item value="offers">My Offers</TabsList.Item>
            <TabsList.Item value="loans" className="relative">
              Active Loans
              {pendingConfirmations > 0 && (
                <span className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center">
                  {pendingConfirmations}
                </span>
              )}
            </TabsList.Item>
          </TabsList>
          
          <TabsContent value="offers">
            {isOffersLoading ? (
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
            ) : userOffers && userOffers.length > 0 ? (
              <div className="grid gap-6">
                {userOffers.map((offer) => (
                  <Card
                    key={offer.id}
                    className="p-6 card-hover"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <h3 className="text-xl font-medium">{offer.full_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Created on {new Date(offer.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="space-x-2">
                          <Badge
                            variant="secondary"
                            className="bg-mint-100 text-mint-800"
                          >
                            {offer.payment_method}
                          </Badge>
                          {offer.interest_rate && (
                            <Badge variant="outline" className="bg-amber-100 text-amber-800">
                              {offer.interest_rate}% interest
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-semibold text-mint-600">
                          M{offer.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Amount offered</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center text-muted-foreground">
                You haven't created any lending offers yet.
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="loans">
            {isLoansLoading ? (
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
            ) : activeLoans && activeLoans.length > 0 ? (
              <div className="grid gap-6">
                {activeLoans.map((loan) => (
                  <Card
                    key={loan.id}
                    className={`p-6 cursor-pointer hover:shadow-md transition-shadow ${
                      loan.status === 'paid' ? 'bg-green-50' : ''
                    }`}
                    onClick={() => handleLoanClick(loan.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-medium">Loan #{loan.id.slice(0, 8)}</h3>
                            {loan.status === 'paid' && (
                              <Badge className="bg-red-100 text-red-800">
                                Action Required
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Created on {new Date(loan.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="space-x-2">
                          <Badge
                            variant="secondary"
                            className="bg-mint-100 text-mint-800"
                          >
                            {loan.offer.payment_method}
                          </Badge>
                          {loan.status === 'pending' && (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                              Payment Pending
                            </Badge>
                          )}
                          {loan.status === 'paid' && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              Payment Received
                            </Badge>
                          )}
                          {loan.status === 'confirmed' && (
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              Payment Confirmed
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-semibold text-mint-600">
                          M{loan.offer.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Loan amount</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center text-muted-foreground">
                You don't have any active loans yet.
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Loan Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Loan Details</DialogTitle>
            <DialogDescription>
              {selectedLoan && activeLoans?.find(loan => loan.id === selectedLoan)?.status === 'paid' 
                ? "Review payment and confirm" 
                : "Loan details"}
            </DialogDescription>
          </DialogHeader>
          
          {selectedLoan && activeLoans && (
            <div className="space-y-4 py-4">
              {(() => {
                const loan = activeLoans.find(l => l.id === selectedLoan);
                if (!loan) return null;
                
                return (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Amount</p>
                        <p className="text-sm text-muted-foreground">M{loan.offer.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <p className="text-sm text-muted-foreground">
                          {loan.status === 'pending' && "Payment Pending"}
                          {loan.status === 'paid' && "Payment Received"}
                          {loan.status === 'confirmed' && "Payment Confirmed"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Payment Method</p>
                        <p className="text-sm text-muted-foreground">{loan.offer.payment_method}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Date</p>
                        <p className="text-sm text-muted-foreground">{new Date(loan.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {loan.payment_proof && (
                      <div>
                        <p className="text-sm font-medium">Payment Proof</p>
                        <p className="text-sm mt-1 p-2 bg-gray-50 border border-gray-200 rounded">
                          {loan.payment_proof}
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
              onClick={() => setDialogOpen(false)}
            >
              Close
            </Button>
            {selectedLoan && activeLoans?.find(loan => loan.id === selectedLoan)?.status === 'paid' && (
              <Button 
                type="button"
                className="bg-mint-500 hover:bg-mint-600"
                onClick={handleConfirmPayment}
                disabled={isConfirming}
              >
                {isConfirming ? "Confirming..." : "Confirm Payment"}
                <Check className="ml-2 h-4 w-4" />
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Lendings;
