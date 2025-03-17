import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useUserLenderOffers } from "@/hooks/use-lender-offers";
import { useLenderLoansWithNotifications, useConfirmLoanPayment } from "@/hooks/use-lender-loans-with-notifications";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Bell, CheckCircle, ExternalLink } from "lucide-react";
import { CreateLenderOfferForm } from "@/components/CreateLenderOfferForm";
import { LenderOffer } from "@/types/lender";
import { Skeleton } from "@/components/ui/skeleton";

const Lendings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: myOffers, isLoading: isLoadingOffers } = useUserLenderOffers();
  const { data: lenderLoansData, isLoading: isLoadingLoans } = useLenderLoansWithNotifications();
  const { mutate: confirmPayment, isPending: isConfirmingPayment } = useConfirmLoanPayment();
  
  const [isCreateOfferOpen, setIsCreateOfferOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [isPaymentDetailsOpen, setIsPaymentDetailsOpen] = useState(false);
  
  const activeLoans = lenderLoansData?.loans || [];
  const notificationCount = lenderLoansData?.notificationCount || 0;

  const handleLoanClick = (loan: any) => {
    setSelectedLoan(loan);
    setIsPaymentDetailsOpen(true);
  };

  const handleConfirmPayment = () => {
    if (selectedLoan) {
      confirmPayment(selectedLoan.id, {
        onSuccess: () => {
          setIsPaymentDetailsOpen(false);
        }
      });
    }
  };
  
  const renderPaymentProofDetails = () => {
    if (!selectedLoan) return null;
    
    const { payment_proof } = selectedLoan;
    
    const hasUrl = payment_proof?.includes('http');
    
    let textProof = payment_proof;
    let fileUrl = '';
    
    if (hasUrl && payment_proof?.includes('|')) {
      const parts = payment_proof.split('|').map(p => p.trim());
      textProof = parts[0];
      fileUrl = parts[1];
    } 
    else if (hasUrl) {
      textProof = '';
      fileUrl = payment_proof;
    }
    
    return (
      <div className="space-y-4">
        {textProof && (
          <div>
            <p className="text-sm font-medium">Transaction ID/Reference</p>
            <p className="text-sm font-mono bg-gray-100 p-2 rounded">{textProof}</p>
          </div>
        )}
        
        {fileUrl && (
          <div>
            <p className="text-sm font-medium">Payment Proof</p>
            {fileUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
              <div className="mt-2 border rounded overflow-hidden">
                <img src={fileUrl} alt="Payment proof" className="max-w-full h-auto" />
              </div>
            ) : (
              <Button variant="outline" onClick={() => window.open(fileUrl, '_blank')}>
                View Document <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-50 to-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
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
          
          <Button onClick={() => setIsCreateOfferOpen(true)} className="bg-mint-500 hover:bg-mint-600">
            <Plus className="mr-2 h-4 w-4" />
            Create Offer
          </Button>
        </div>
        
        <Tabs defaultValue="offers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="offers">My Offers</TabsTrigger>
            <TabsTrigger value="active-loans" className="relative">
              Active Loans
              {notificationCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {notificationCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="offers" className="space-y-4">
            {isLoadingOffers ? (
              <div className="grid gap-4">
                {[1, 2, 3].map((_, i) => (
                  <Card key={i} className="p-6">
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-36" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : myOffers && myOffers.length > 0 ? (
              <div className="grid gap-4">
                {myOffers.map((offer: LenderOffer) => (
                  <Card key={offer.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-xl font-medium">{offer.full_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {offer.contact} • {offer.payment_method}
                        </p>
                        <p className="text-2xl font-semibold text-mint-600">
                          M{offer.amount.toLocaleString()}
                        </p>
                        {offer.interest_rate && (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800">
                            {offer.interest_rate}% interest
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        Created {new Date(offer.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center text-muted-foreground">
                You don't have any active offers
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="active-loans" className="space-y-4">
            {isLoadingLoans ? (
              <div className="grid gap-4">
                {[1, 2, 3].map((_, i) => (
                  <Card key={i} className="p-6">
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-36" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : activeLoans && activeLoans.length > 0 ? (
              <div className="grid gap-4">
                {activeLoans.map((loan: any) => (
                  <Card 
                    key={loan.id} 
                    className={`p-6 ${loan.status === 'paid' ? 'border-2 border-orange-300 cursor-pointer' : ''}`}
                    onClick={() => loan.payment_proof && handleLoanClick(loan)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <h3 className="text-xl font-medium">
                            {loan.borrower?.full_name || 'Unknown Borrower'}
                          </h3>
                          {loan.status === 'paid' && (
                            <Badge className="ml-2 bg-orange-100 text-orange-800 flex items-center gap-1">
                              <Bell className="h-3 w-3" /> Payment Received
                            </Badge>
                          )}
                          {loan.status === 'confirmed' && (
                            <Badge className="ml-2 bg-green-100 text-green-800 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" /> Payment Confirmed
                            </Badge>
                          )}
                          {loan.status === 'pending' && (
                            <Badge className="ml-2 bg-yellow-100 text-yellow-800">
                              Awaiting Payment
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {loan.borrower?.contact || 'No contact info'} • Borrowed on {new Date(loan.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-2xl font-semibold text-mint-600">
                          M{loan.offer?.amount.toLocaleString()}
                        </p>
                        {loan.offer?.interest_rate && (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800">
                            {loan.offer.interest_rate}% interest
                          </Badge>
                        )}
                      </div>
                      
                      {loan.payment_proof && loan.status === 'paid' && (
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          View Payment <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center text-muted-foreground">
                You don't have any active loans
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={isCreateOfferOpen} onOpenChange={setIsCreateOfferOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a Lending Offer</DialogTitle>
          </DialogHeader>
          <CreateLenderOfferForm onDismiss={() => setIsCreateOfferOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isPaymentDetailsOpen} onOpenChange={setIsPaymentDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Review the payment proof submitted by the borrower
            </DialogDescription>
          </DialogHeader>
          
          {selectedLoan && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Borrower</p>
                  <p className="text-sm text-muted-foreground">{selectedLoan.borrower?.full_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Amount</p>
                  <p className="text-sm text-muted-foreground">M{selectedLoan.offer?.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Payment Method</p>
                  <p className="text-sm text-muted-foreground">{selectedLoan.offer?.payment_method}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedLoan.updated_at).toLocaleDateString()} {new Date(selectedLoan.updated_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium mb-2">Payment Proof</h4>
                {renderPaymentProofDetails()}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsPaymentDetailsOpen(false)}
            >
              Close
            </Button>
            {selectedLoan?.status === 'paid' && (
              <Button 
                type="button"
                className="bg-mint-500 hover:bg-mint-600"
                onClick={handleConfirmPayment}
                disabled={isConfirmingPayment}
              >
                {isConfirmingPayment ? "Confirming..." : "Confirm Payment"}
                <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Lendings;
