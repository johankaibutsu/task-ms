"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskCard } from "@/components/task-card";
import { Plus, Search, LogOut, Loader2 } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState<Partial<Task>>({});
  const [showForm, setShowForm] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/tasks`, {
        params: { page, limit: 5, search, status: statusFilter },
      });
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
    } catch (e) {
      // Error handled by interceptor (redirects to login)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, search, statusFilter]);

  const handleLogout = async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentTask.id) {
        await api.patch(`/tasks/${currentTask.id}`, {
          title: currentTask.title,
          description: currentTask.description,
        });
      } else {
        await api.post("/tasks", {
          title: currentTask.title,
          description: currentTask.description,
        });
      }
      setShowForm(false);
      setCurrentTask({});
      setIsEditing(false);
      fetchTasks();
    } catch (error) {
      alert("Failed to save task");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const handleToggle = async (id: string) => {
    await api.patch(`/tasks/${id}/toggle`);
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-slate-900">Task Manager</h1>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut size={16} /> Logout
        </Button>
      </header>

      <main className="max-w-3xl mx-auto p-6">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-2.5 text-slate-400"
              size={18}
            />
            <Input
              placeholder="Search tasks..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <Button
            onClick={() => {
              setShowForm(true);
              setIsEditing(false);
              setCurrentTask({});
            }}
          >
            <Plus size={18} className="mr-2" /> Add Task
          </Button>
        </div>

        {/* Task Form Modal (Simplified inline for brevity) */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <form
              onSubmit={handleSave}
              className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl"
            >
              <h2 className="text-lg font-bold mb-4">
                {isEditing ? "Edit Task" : "New Task"}
              </h2>
              <Input
                placeholder="Task Title"
                className="mb-4"
                value={currentTask.title || ""}
                onChange={(e) =>
                  setCurrentTask({ ...currentTask, title: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Description (Optional)"
                className="w-full px-3 py-2 border border-slate-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-slate-400"
                value={currentTask.description || ""}
                onChange={(e) =>
                  setCurrentTask({
                    ...currentTask,
                    description: e.target.value,
                  })
                }
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        )}

        {/* Task List */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-slate-400" />
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.length === 0 && (
              <p className="text-center text-slate-500 py-10">
                No tasks found.
              </p>
            )}
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={handleDelete}
                onToggle={handleToggle}
                onEdit={(t) => {
                  setCurrentTask(t);
                  setIsEditing(true);
                  setShowForm(true);
                }}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-slate-600">
            Page {page} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </main>
    </div>
  );
}
