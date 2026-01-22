import React from "react";
import { Check, Trash2, Edit2, Clock } from "lucide-react";
import { Button } from "./ui/button";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
}

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onToggle, onDelete, onEdit }: TaskCardProps) {
  const isCompleted = task.status === "COMPLETED";

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center justify-between">
      <div className="flex-1">
        <h3
          className={`font-semibold text-lg ${isCompleted ? "text-slate-400 line-through" : "text-slate-900"}`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="text-slate-500 text-sm mt-1">{task.description}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span
            className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
              isCompleted
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {isCompleted ? <Check size={12} /> : <Clock size={12} />}
            {task.status}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggle(task.id)}
          className="p-2"
        >
          {isCompleted ? "Undo" : "Done"}
        </Button>
        <Button variant="ghost" onClick={() => onEdit(task)} className="p-2">
          <Edit2 size={18} />
        </Button>
        <Button
          variant="ghost"
          onClick={() => onDelete(task.id)}
          className="p-2 text-red-500 hover:text-red-700"
        >
          <Trash2 size={18} />
        </Button>
      </div>
    </div>
  );
}
