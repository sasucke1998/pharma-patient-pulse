import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Phone, Cake, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Employee {
  id: string;
  name: string;
  birthday: string;
  phone: string;
  salesHistory: Array<{ date: string; amount: number }>;
  errors: Array<{ date: string; description: string }>;
}

interface EmployeeCardProps {
  employee: Employee;
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = employee.phone.replace(/\D/g, '');
    const message = `Hola ${employee.name}, este es un mensaje de la empresa.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{employee.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {/* Información esencial siempre visible */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{employee.phone}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2 bg-green-500 hover:bg-green-600 text-white"
              onClick={handleWhatsAppClick}
            >
              WhatsApp
            </Button>
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
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Cake className="h-4 w-4" />
                <span>Cumpleaños: {formatDate(employee.birthday)}</span>
              </div>

              {/* Gráfico de ventas */}
              <div className="h-64 mt-4">
                <h3 className="text-sm font-semibold mb-2">Historial de Ventas</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={employee.salesHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Botón de errores */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Ver Errores
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registro de Errores</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {employee.errors.map((error, index) => (
                      <div key={index} className="border-b pb-2">
                        <p className="font-semibold">{formatDate(error.date)}</p>
                        <p className="text-sm text-muted-foreground">
                          {error.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}