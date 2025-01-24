import { useState } from "react";
import { AddPatientDialog } from "@/components/AddPatientDialog";
import { PatientCard } from "@/components/PatientCard";
import { DashboardStats } from "@/components/Dashboard";

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

  const purchasedThisMonth = patients.filter(
    (patient) => patient.hasPurchasedThisMonth
  ).length;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Sistema de Gestión de Farmacia</h1>
      
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
          />
        ))}
      </div>
    </div>
  );
};

export default Index;