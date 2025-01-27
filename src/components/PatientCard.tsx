import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Check, Phone, Cake, X, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { EditPatientDialog } from "./EditPatientDialog";
import { useState } from "react";

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
  const [showDetails, setShowDetails] = useState(false);

  const handlePurchaseToggle = () => {
    onPurchaseToggle(patient.id);
    toast.success(`Estado de compra actualizado para ${patient.name}`);
  };

  const calculateNextPurchaseDate = () => {
    const firstPurchase = new Date(patient.nextPurchaseDate);
    const today = new Date();
    
    let nextDate = new Date(firstPurchase);
    while (nextDate < today) {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }
    
    return nextDate;
  };

  const nextPurchaseDate = calculateNextPurchaseDate();
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

  const handleWhatsAppClick = () => {
    const phoneNumber = patient.phone.replace(/\D/g, ''); // Remove non-numeric characters
    const message = `Hola ${patient.name}, este es un recordatorio para su próxima compra de medicamentos.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (daysUntilPurchase <= 3 && daysUntilPurchase > 0 && !patient.hasPurchasedThisMonth) {
    toast.warning(
      `${patient.name} debe comprar sus medicamentos pronto`,
      {
        duration: Infinity,
        icon: <AlertCircle className="h-4 w-4" />,
      }
    );
  }

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
          {/* Información esencial siempre visible */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{patient.phone}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2 bg-green-500 hover:bg-green-600 text-white"
              onClick={handleWhatsAppClick}
            >
              WhatsApp
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            <strong>Prescripción:</strong> {patient.prescription}
          </div>

          {/* Botón para mostrar/ocultar detalles adicionales */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="mt-2"
          >
            {showDetails ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Ocultar Detalles
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Ver Más Detalles
              </>
            )}
          </Button>

          {/* Información adicional oculta por defecto */}
          {showDetails && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Cake className="h-4 w-4" />
                <span>Cumpleaños: {formatDate(patient.birthday)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Fecha Primera Compra: {formatDate(patient.nextPurchaseDate)}</span>
              </div>
              <div
                className={`flex items-center gap-2 text-sm ${
                  daysUntilPurchase <= 3 ? "text-red-500" : "text-muted-foreground"
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>
                  Próxima compra mensual:{" "}
                  {daysUntilPurchase <= 0
                    ? "Vencido"
                    : `${daysUntilPurchase} días restantes`}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}