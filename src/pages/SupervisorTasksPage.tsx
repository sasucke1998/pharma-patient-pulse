import { SupervisorTasks } from "@/components/SupervisorTasks";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SupervisorTasksPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Panel del Supervisor</h1>
        <Button onClick={() => navigate('/')}>
          Volver al Principal
        </Button>
      </div>
      <SupervisorTasks />
    </div>
  );
};

export default SupervisorTasksPage;