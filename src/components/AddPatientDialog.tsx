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
  }) => void;
}

export function AddPatientDialog({ onAddPatient }: AddPatientDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [prescription, setPrescription] = useState("");
  const [nextPurchaseDate, setNextPurchaseDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !prescription || !nextPurchaseDate) {
      toast.error("Please fill in all fields");
      return;
    }
    onAddPatient({ name, prescription, nextPurchaseDate });
    setName("");
    setPrescription("");
    setNextPurchaseDate("");
    setOpen(false);
    toast.success("Patient added successfully");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Add New Patient</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Patient Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter patient name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="prescription">Prescription</Label>
            <Input
              id="prescription"
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              placeholder="Enter prescription details"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nextPurchaseDate">Next Purchase Date</Label>
            <Input
              id="nextPurchaseDate"
              type="date"
              value={nextPurchaseDate}
              onChange={(e) => setNextPurchaseDate(e.target.value)}
            />
          </div>
          <Button type="submit">Add Patient</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}