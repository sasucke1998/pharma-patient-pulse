import { useState } from "react";
import { AddPatientDialog } from "@/components/AddPatientDialog";
import { PatientCard } from "@/components/PatientCard";
import { DashboardStats } from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Patient {
  id: string;
  name: string;
  prescription: string;
  nextPurchaseDate: string;
  hasPurchasedThisMonth: boolean;
  phone: string;
  birthday: string;
}

const Index = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const navigate = useNavigate();

  const handleAddPatient = (patientData: {
    name: string;
    prescription: string;
    nextPurchaseDate: string;
    phone: string;
    birthday: string;
  }) => {
    const newPatient: Patient = {
      id: crypto.randomUUID(),
      ...patientData,
      hasPurchasedThisMonth: false,
    };
    setPatients((prev) => [...prev, newPatient]);
  };

  const handlePurchaseToggle = (patientId: string) => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === patientId
          ? { ...patient, hasPurchasedThisMonth: !patient.hasPurchasedThisMonth }
          : patient
      )
    );
  };

  const handleEditPatient = (patientId: string, updatedData: {
    name: string;
    prescription: string;
    nextPurchaseDate: string;
    phone: string;
    birthday: string;
  }) => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === patientId
          ? { ...patient, ...updatedData }
          : patient
      )
    );
  };

  const purchasedThisMonth = patients.filter(
    (patient) => patient.hasPurchasedThisMonth
  ).length;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Sistema de Gestión de Farmacia</h1>
        <Button onClick={() => navigate('/supervisor')}>
          Panel del Supervisor
        </Button>
      </div>
      
      <DashboardStats
        totalPatients={patients.length}
        purchasedThisMonth={purchasedThisMonth}
        pendingPurchases={patients.length - purchasedThisMonth}
      />

      <div className="mt-8 mb-6">
        <AddPatientDialog onAddPatient={handleAddPatient} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {patients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onPurchaseToggle={handlePurchaseToggle}
            onEditPatient={handleEditPatient}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;