import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Check, Phone, Cake, X } from "lucide-react";
import { toast } from "sonner";
import { EditPatientDialog } from "./EditPatientDialog";

interface PatientCardProps {
  patient: {
    id: string;
    name: string;
    prescription: string;
    nextPurchaseDate: string;
    hasPurchasedThisMonth: boolean;
    phone: string;
    birthday: string;
  };
  onPurchaseToggle: (id: string) => void;
  onEditPatient: (id: string, patient: {
    name: string;
    prescription: string;
    nextPurchaseDate: string;
    phone: string;
    birthday: string;
  }) => void;
}

export function PatientCard({ patient, onPurchaseToggle, onEditPatient }: PatientCardProps) {
  const handlePurchaseToggle = () => {
    onPurchaseToggle(patient.id);
    toast.success(`Estado de compra actualizado para ${patient.name}`);
  };

  const nextPurchaseDate = new Date(patient.nextPurchaseDate);
  const today = new Date();
  const daysUntilPurchase = Math.ceil(
    (nextPurchaseDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{patient.name}</CardTitle>
        <div className="flex gap-2">
          <EditPatientDialog patient={patient} onEditPatient={onEditPatient} />
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
            {patient.hasPurchasedThisMonth ? "Deshacer Compra" : "Marcar Comprado"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{patient.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Cake className="h-4 w-4" />
            <span>Cumpleaños: {formatDate(patient.birthday)}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            <strong>Prescripción:</strong> {patient.prescription}
          </div>
          <div
            className={`flex items-center gap-2 text-sm ${
              daysUntilPurchase <= 7 ? "text-red-500" : "text-muted-foreground"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>
              Próxima compra:{" "}
              {daysUntilPurchase <= 0
                ? "Vencido"
                : `${daysUntilPurchase} días restantes`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}