import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle, Clock, Trash2, PenTool } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddTaskDialog } from "./AddTaskDialog";
import { format, addMinutes, isBefore, isAfter, parseISO } from "date-fns";

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
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();
  const [notifiedTasks, setNotifiedTasks] = useState<Set<string>>(new Set());

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
        setNotifiedTasks(new Set()); // Reset notified tasks
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
      const now = new Date();
      
      tasks.forEach(task => {
        if (task.completed) return;

        const [hours, minutes] = task.time.split(':').map(Number);
        const taskTime = new Date();
        taskTime.setHours(hours, minutes, 0, 0);
        
        const thirtyMinutesBefore = addMinutes(taskTime, -30);
        
        // Si estamos después de 30 minutos antes de la tarea y antes de la hora de la tarea
        if (isAfter(now, thirtyMinutesBefore) && isBefore(now, taskTime) && !notifiedTasks.has(`${task.id}-pre`)) {
          toast({
            title: "¡Tarea Próxima!",
            description: `En 30 minutos debes realizar la tarea: "${task.title}"`,
            duration: 10000, // 10 segundos
          });
          setNotifiedTasks(prev => new Set(prev).add(`${task.id}-pre`));
        }
        
        // Si ya pasó la hora de la tarea y no está completada
        if (isAfter(now, taskTime) && !task.completed) {
          toast({
            title: "¡Tarea Pendiente!",
            description: `Es hora de realizar la tarea: "${task.title}"`,
            duration: 10000, // 10 segundos
          });
          
          // Programar recordatorios cada 5 minutos
          if (!notifiedTasks.has(`${task.id}-${now.getMinutes()}`)) {
            setNotifiedTasks(prev => new Set(prev).add(`${task.id}-${now.getMinutes()}`));
          }
        }
      });
    };

    const interval = setInterval(checkTasks, 1000 * 60); // Revisar cada minuto
    checkTasks(); // Ejecutar inmediatamente al montar
    
    return () => clearInterval(interval);
  }, [tasks, toast, notifiedTasks]);

  const handleAddTask = (newTask: Omit<Task, "id" | "completed">) => {
    const task: Task = {
      id: crypto.randomUUID(),
      ...newTask,
      completed: false,
    };
    setTasks(prev => [...prev, task]);
    setIsAddTaskOpen(false);
  };

  const handleEditTask = (taskToEdit: Task) => {
    setEditingTask(taskToEdit);
    setIsAddTaskOpen(true);
  };

  const handleUpdateTask = (updatedTask: Omit<Task, "id" | "completed">) => {
    if (editingTask) {
      setTasks(prev =>
        prev.map(task =>
          task.id === editingTask.id
            ? { ...task, ...updatedTask }
            : task
        )
      );
      setEditingTask(null);
      setIsAddTaskOpen(false);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
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
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditTask(task)}
                >
                  <PenTool className="h-4 w-4 text-blue-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
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
        onAddTask={editingTask ? handleUpdateTask : handleAddTask}
        editingTask={editingTask}
      />
    </Card>
  );
}