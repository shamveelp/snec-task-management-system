import * as React from "react";
import { tasksApi, TaskData } from "../../lib/api/tasks.api";
import { Loader2, Plus, MessageSquare, Paperclip, Clock, Calendar, Flag } from "lucide-react";
import { Button } from "../ui/button";
import { CreateTaskModal } from "./create-task-modal";

interface KanbanBoardProps {
  projectId: string;
}

const COLUMNS = [
  { id: 'TODO', title: 'To Do', color: 'bg-gray-100', border: 'border-gray-200' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-50', border: 'border-blue-200' },
  { id: 'IN_REVIEW', title: 'In Review', color: 'bg-amber-50', border: 'border-amber-200' },
  { id: 'DONE', title: 'Done', color: 'bg-emerald-50', border: 'border-emerald-200' },
];

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const [tasks, setTasks] = React.useState<TaskData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [draggedTaskId, setDraggedTaskId] = React.useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      const data = await tasksApi.getTasksByProject(projectId);
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    // Small delay to prevent the dragged element from disappearing
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.style.opacity = '0.5';
      }
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedTaskId(null);
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (!draggedTaskId) return;

    // Optimistically update
    const previousTasks = [...tasks];
    setTasks(tasks.map(t => t.id === draggedTaskId ? { ...t, status: status as any } : t));

    try {
      await tasksApi.updateTask(draggedTaskId, { status });
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to update task status');
      setTasks(previousTasks); // Revert on failure
    }
    setDraggedTaskId(null);
  };

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'URGENT': return <Flag className="h-3.5 w-3.5 text-red-500 fill-red-500" />;
      case 'HIGH': return <Flag className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />;
      case 'MEDIUM': return <Flag className="h-3.5 w-3.5 text-blue-500" />;
      case 'LOW': return <Flag className="h-3.5 w-3.5 text-gray-400" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="h-8 w-8 animate-spin text-[#7C68EE]" />
      </div>
    );
  }

  return (
    <div className="h-full bg-[#F8FAFC] flex flex-col overflow-hidden">
      
      {/* Board Toolbar */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {/* Avatars of assignees could go here */}
          </div>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#7C68EE] hover:bg-[#6b58dd] text-white rounded-lg px-4 h-9 shadow-sm font-medium text-sm"
        >
          <Plus className="h-4 w-4 mr-1.5" /> Add Task
        </Button>
      </div>

      {/* Kanban Canvas */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 stylish-scrollbar">
        <div className="flex h-full gap-6 items-start min-w-max">
          
          {COLUMNS.map(column => {
            const columnTasks = tasks.filter(t => t.status === column.id);
            
            return (
              <div 
                key={column.id}
                className="w-[320px] max-h-full flex flex-col rounded-2xl bg-gray-50/50 border border-gray-100 flex-shrink-0 overflow-hidden"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div className="p-4 flex items-center justify-between border-b border-gray-100 bg-white/50">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${column.color.replace('bg-', 'bg-').replace('50', '400')}`}></div>
                    <h3 className="font-bold text-gray-900">{column.title}</h3>
                  </div>
                  <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Column Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 stylish-scrollbar">
                  {columnTasks.map(task => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => alert(`Task details coming soon: ${task.title}`)}
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:border-gray-300 hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-gray-400">TASK-{task.id.split('-')[0].toUpperCase()}</span>
                        <div title={task.priority}>
                          {getPriorityIcon(task.priority)}
                        </div>
                      </div>
                      
                      <h4 className="text-sm font-bold text-gray-900 leading-tight mb-2 group-hover:text-[#7C68EE] transition-colors">
                        {task.title}
                      </h4>
                      
                      {task.dueDate && (
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-3 font-medium">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-3 text-gray-400">
                          {task._count && task._count.comments > 0 && (
                            <div className="flex items-center gap-1 text-[11px] font-medium">
                              <MessageSquare className="h-3.5 w-3.5" /> {task._count.comments}
                            </div>
                          )}
                          {task._count && task._count.attachments > 0 && (
                            <div className="flex items-center gap-1 text-[11px] font-medium">
                              <Paperclip className="h-3.5 w-3.5" /> {task._count.attachments}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          {task.assignee ? (
                            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-[#7C68EE] to-[#4c3ab8] flex items-center justify-center text-white font-bold text-[9px] shadow-sm overflow-hidden" title={task.assignee.name}>
                              {task.assignee.profilePicture ? (
                                <img src={task.assignee.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                task.assignee.name.charAt(0).toUpperCase()
                              )}
                            </div>
                          ) : (
                            <div className="h-6 w-6 rounded-full bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400" title="Unassigned">
                              <span className="text-[10px]">?</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Empty Drop Zone */}
                  {columnTasks.length === 0 && (
                    <div className="h-24 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-sm font-medium">
                      Drop here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
        </div>
      </div>

      <CreateTaskModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={fetchTasks}
        projectId={projectId}
      />
    </div>
  );
}
