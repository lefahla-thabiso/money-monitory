
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateLenderOfferForm } from "@/components/CreateLenderOfferForm";

export const DashboardHeader = () => {
  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">Available Lenders</h2>
        <p className="text-muted-foreground mt-1">Find trusted lenders in your area</p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-mint-500 hover:bg-mint-600">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Offer
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <CreateLenderOfferForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};
