import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddTaskDialog } from "./AddTaskDialog";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  time: string;
  completed: boolean;
}

export function SupervisorTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("supervisorTasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const { toast } = useToast();

  // Efecto para guardar tareas en localStorage
  useEffect(() => {
    localStorage.setItem("supervisorTasks", JSON.stringify(tasks));
  }, [tasks]);

  // Efecto para reiniciar tareas cada día
  useEffect(() => {
    const checkDate = () => {
      const lastReset = localStorage.getItem("lastTaskReset");
      const today = new Date().toDateString();
      
      if (lastReset !== today) {
        setTasks(prevTasks => 
          prevTasks.map(task => ({ ...task, completed: false }))
        );
        localStorage.setItem("lastTaskReset", today);
      }
    };

    checkDate();
    const interval = setInterval(checkDate, 1000 * 60); // Revisar cada minuto
    return () => clearInterval(interval);
  }, []);

  // Efecto para notificaciones de tareas
  useEffect(() => {
    const checkTasks = () => {
      tasks.forEach(task => {
        if (!task.completed) {
          const [hours, minutes] = task.time.split(":");
          const taskTime = new Date();
          taskTime.setHours(parseInt(hours), parseInt(minutes), 0);
          
          const now = new Date();
          const timeDiff = taskTime.getTime() - now.getTime();
          
          // Notificar 5 minutos antes
          if (timeDiff > 0 && timeDiff <= 1000 * 60 * 5) {
            toast({
              title: "¡Tarea Próxima!",
              description: `La tarea "${task.title}" debe realizarse a las ${task.time}`,
            });
          }
        }
      });
    };

    const interval = setInterval(checkTasks, 1000 * 60); // Revisar cada minuto
    return () => clearInterval(interval);
  }, [tasks, toast]);

  const handleAddTask = (newTask: Omit<Task, "id" | "completed">) => {
    const task: Task = {
      id: crypto.randomUUID(),
      ...newTask,
      completed: false,
    };
    setTasks(prev => [...prev, task]);
    setIsAddTaskOpen(false);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Tareas del Supervisor</CardTitle>
        <Button onClick={() => setIsAddTaskOpen(true)} variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                task.completed ? "bg-gray-100" : "bg-white"
              }`}
            >
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleTaskCompletion(task.id)}
                >
                  <CheckCircle
                    className={`h-5 w-5 ${
                      task.completed ? "text-green-500" : "text-gray-400"
                    }`}
                  />
                </Button>
                <div>
                  <p className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {task.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <p className="text-center text-gray-500">No hay tareas programadas</p>
          )}
        </div>
      </CardContent>
      <AddTaskDialog
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        onAddTask={handleAddTask}
      />
    </Card>
  );
}