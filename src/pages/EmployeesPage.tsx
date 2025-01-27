import { Button } from "@/components/ui/button";
import { EmployeeCard } from "@/components/EmployeeCard";
import { useState } from "react";

const mockEmployees = [
  {
    id: "1",
    name: "Juan Pérez",
    birthday: "1990-05-15",
    phone: "+1234567890",
    salesHistory: [
      { date: "2024-03-20", amount: 1500 },
      { date: "2024-03-21", amount: 2000 },
      { date: "2024-03-22", amount: 1800 },
    ],
    errors: [
      { date: "2024-03-20", description: "Error en caja" },
      { date: "2024-03-21", description: "Retraso en entrega" },
    ],
  },
];

export default function EmployeesPage() {
  const [employees] = useState(mockEmployees);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Gestión de Empleados</h1>
      <div className="grid gap-6">
        {employees.map((employee) => (
          <EmployeeCard key={employee.id} employee={employee} />
        ))}
      </div>
    </div>
  );
}