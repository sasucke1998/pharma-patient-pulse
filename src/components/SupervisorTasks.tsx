import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function SupervisorTasks() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Panel del Supervisor</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Button 
          variant="outline" 
          className="h-32 text-lg"
          onClick={() => navigate('/pharmacy')}
        >
          Gestión de Clientes
        </Button>
        <Button 
          variant="outline" 
          className="h-32 text-lg"
          onClick={() => navigate('/employees')}
        >
          Gestión de Empleados
        </Button>
        <Button 
          variant="outline" 
          className="h-32 text-lg"
          onClick={() => navigate('/tasks')}
        >
          Tareas del Supervisor
        </Button>
      </div>
    </div>
  );
}