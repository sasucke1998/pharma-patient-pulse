import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Edit2 } from "lucide-react";

interface EditPatientDialogProps {
  patient: {
    id: string;
    name: string;
    prescription: string;
    nextPurchaseDate: string;
    phone: string;
    birthday: string;
  };
  onEditPatient: (id: string, patient: {
    name: string;
    prescription: string;
    nextPurchaseDate: string;
    phone: string;
    birthday: string;
  }) => void;
}

export function EditPatientDialog({ patient, onEditPatient }: EditPatientDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(patient.name);
  const [prescription, setPrescription] = useState(patient.prescription);
  const [firstPurchaseDate, setFirstPurchaseDate] = useState(patient.nextPurchaseDate);
  const [phone, setPhone] = useState(patient.phone);
  const [birthday, setBirthday] = useState(patient.birthday);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !prescription || !firstPurchaseDate || !phone || !birthday) {
      toast.error("Por favor complete todos los campos");
      return;
    }
    onEditPatient(patient.id, { 
      name, 
      prescription, 
      nextPurchaseDate: firstPurchaseDate,
      phone, 
      birthday 
    });
    setOpen(false);
    toast.success("Paciente actualizado exitosamente");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Paciente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre del Paciente</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingrese el nombre del paciente"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ingrese el número de teléfono"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="birthday">Fecha de Nacimiento</Label>
            <Input
              id="birthday"
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="prescription">Prescripción</Label>
            <Input
              id="prescription"
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              placeholder="Ingrese detalles de la prescripción"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="firstPurchaseDate">Fecha de Primera Compra</Label>
            <Input
              id="firstPurchaseDate"
              type="date"
              value={firstPurchaseDate}
              onChange={(e) => setFirstPurchaseDate(e.target.value)}
            />
          </div>
          <Button type="submit">Actualizar Paciente</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}