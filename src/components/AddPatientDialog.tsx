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

interface AddPatientDialogProps {
  onAddPatient: (patient: {
    name: string;
    prescription: string;
    nextPurchaseDate: string;
    phone: string;
    birthday: string;
  }) => void;
}

export function AddPatientDialog({ onAddPatient }: AddPatientDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [prescription, setPrescription] = useState("");
  const [nextPurchaseDate, setNextPurchaseDate] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !prescription || !nextPurchaseDate || !phone || !birthday) {
      toast.error("Por favor complete todos los campos");
      return;
    }
    onAddPatient({ name, prescription, nextPurchaseDate, phone, birthday });
    setName("");
    setPrescription("");
    setNextPurchaseDate("");
    setPhone("");
    setBirthday("");
    setOpen(false);
    toast.success("Paciente agregado exitosamente");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Agregar Nuevo Paciente</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Paciente</DialogTitle>
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
            <Label htmlFor="nextPurchaseDate">Próxima Fecha de Compra</Label>
            <Input
              id="nextPurchaseDate"
              type="date"
              value={nextPurchaseDate}
              onChange={(e) => setNextPurchaseDate(e.target.value)}
            />
          </div>
          <Button type="submit">Agregar Paciente</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}