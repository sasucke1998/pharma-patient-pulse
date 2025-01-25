import { SupervisorTasks } from "@/components/SupervisorTasks";

const SupervisorTasksPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Panel del Supervisor</h1>
      <SupervisorTasks />
    </div>
  );
};

export default SupervisorTasksPage;