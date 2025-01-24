import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Check, X } from "lucide-react";
import { toast } from "sonner";

interface PatientCardProps {
  patient: {
    id: string;
    name: string;
    prescription: string;
    nextPurchaseDate: string;
    hasPurchasedThisMonth: boolean;
  };
  onPurchaseToggle: (id: string) => void;
}

export function PatientCard({ patient, onPurchaseToggle }: PatientCardProps) {
  const handlePurchaseToggle = () => {
    onPurchaseToggle(patient.id);
    toast.success(`Purchase status updated for ${patient.name}`);
  };

  const nextPurchaseDate = new Date(patient.nextPurchaseDate);
  const today = new Date();
  const daysUntilPurchase = Math.ceil(
    (nextPurchaseDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{patient.name}</CardTitle>
        <Button
          onClick={handlePurchaseToggle}
          variant={patient.hasPurchasedThisMonth ? "destructive" : "default"}
          size="sm"
        >
          {patient.hasPurchasedThisMonth ? (
            <X className="mr-2 h-4 w-4" />
          ) : (
            <Check className="mr-2 h-4 w-4" />
          )}
          {patient.hasPurchasedThisMonth ? "Undo Purchase" : "Mark Purchased"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="text-sm text-muted-foreground">
            <strong>Prescription:</strong> {patient.prescription}
          </div>
          <div
            className={`flex items-center gap-2 text-sm ${
              daysUntilPurchase <= 7 ? "text-red-500" : "text-muted-foreground"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>
              Next purchase:{" "}
              {daysUntilPurchase <= 0
                ? "Overdue"
                : `${daysUntilPurchase} days remaining`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}