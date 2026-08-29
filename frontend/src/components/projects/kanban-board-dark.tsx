import * as React from "react";
import { tasksApi, TaskData, ProjectUserRole } from "../../lib/api/tasks.api";
import { ProjectData } from "../../lib/api/projects.api";
import { Loader2, Plus, MessageSquare, Paperclip, Calendar, Flag } from "lucide-react";
import { Button } from "../ui/button";
import { CreateTaskModal } from "./create-task-modal";
import { TaskDetailPanel } from "./task-detail-panel";

interface KanbanBoardDarkProps {
  projectId: string;
  project?: ProjectData | null;
}

const COLUMNS = [
  { id: 'TODO', title: 'To Do', color: 'bg-gray-500', border: 'border-gray-500/20' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-[#7C68EE]', border: 'border-[#7C68EE]/20' },
  { id: 'IN_REVIEW', title: 'In Review', color: 'bg-amber-500', border: 'border-amber-500/20' },
  { id: 'DONE', title: 'Done', color: 'bg-emerald-500', border: 'border-emerald-500/20' },
];

export function KanbanBoardDark({ projectId, project }: KanbanBoardDarkProps) {
  const [tasks, setTasks] = React.useState<TaskData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [projectRole, setProjectRole] = React.useState<ProjectUserRole>('DEVELOPER');
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null);
  const [draggedTaskId, setDraggedTaskId] = React.useState<string | null>(null);

  const canCreateTask = ['ORG_ADMIN', 'PROJECT_MANAGER'].includes(projectRole);

  const fetchTasks = async () => {
    try {
      const [tasksData, roleData] = await Promise.all([
        tasksApi.getTasksByProject(projectId),
        tasksApi.getMyProjectRole(projectId).catch(() => 'DEVELOPER' as ProjectUserRole)
      ]);
      setTasks(tasksData);
      setProjectRole(roleData);
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

    const previousTasks = [...tasks];
    setTasks(tasks.map(t => t.id === draggedTaskId ? { ...t, status: status as any } : t));

    try {
      await tasksApi.updateTask(draggedTaskId, { status });
    } catch (error: any) {
      console.error(error);
      setTasks(previousTasks);
    }
    setDraggedTaskId(null);
  };

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'URGENT': return <Flag className="h-3.5 w-3.5 text-red-500 fill-red-500" />;
      case 'HIGH': return <Flag className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />;
      case 'MEDIUM': return <Flag className="h-3.5 w-3.5 text-blue-400" />;
      case 'LOW': return <Flag className="h-3.5 w-3.5 text-gray-500" />;
      default: return null;
    }
  };

  const defaultProject: ProjectData = project || {
    id: projectId,
    name: "Project",
    description: "",
    startDate: null,
    endDate: null,
    priority: "MEDIUM",
    status: "ACTIVE",
    organizationId: "",
    createdById: "",
    createdAt: new Date().toISOString(),
    members: []
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#131417]">
        <Loader2 className="h-8 w-8 animate-spin text-[#7C68EE]" />
      </div>
    );
  }

  return (
    <div className="h-full bg-[#131417] flex flex-col overflow-hidden">
      
      {/* Board Toolbar */}
      <div className="px-10 py-4 border-b border-white/[0.04] flex justify-between items-center bg-[#0D0E12] flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-[#8F96AE]">
            Total Tasks: <span className="text-white font-bold">{tasks.length}</span>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#7C68EE]/10 text-[#7C68EE] border border-[#7C68EE]/20">
            {projectRole === 'ORG_ADMIN' ? 'Org Admin' :
             projectRole === 'PROJECT_MANAGER' ? 'Project Manager' :
             projectRole === 'TEAM_LEAD' ? 'Team Lead' : 'Developer'}
          </span>
        </div>
        {canCreateTask && (
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#7C68EE] hover:bg-[#6b58dd] text-white rounded-lg px-4 h-9 shadow-sm font-medium text-sm"
          >
            <Plus className="h-4 w-4 mr-1.5" /> Add Task
          </Button>
        )}
      </div>

      {/* Kanban Canvas */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-10 py-6 stylish-scrollbar">
        <div className="flex h-full gap-6 items-start min-w-max">
          
          {COLUMNS.map(column => {
            const columnTasks = tasks.filter(t => t.status === column.id);
            
            return (
              <div 
                key={column.id}
                className="w-[320px] max-h-full flex flex-col rounded-2xl bg-[#1C1E24] border border-white/[0.04] flex-shrink-0 overflow-hidden"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div className="p-4 flex items-center justify-between border-b border-white/[0.04] bg-[#0D0E12]/50">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${column.color}`}></div>
                    <h3 className="font-bold text-white">{column.title}</h3>
                  </div>
                  <span className="bg-white/5 text-white/60 text-xs font-bold px-2 py-0.5 rounded-full">
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
                      onClick={() => setSelectedTaskId(task.id)}
                      className="bg-[#0D0E12] p-4 rounded-xl shadow-sm border border-white/5 cursor-pointer hover:border-[#7C68EE]/50 hover:shadow-lg hover:shadow-[#7C68EE]/10 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-white/30">TASK-{task.id.split('-')[0].toUpperCase()}</span>
                        <div title={task.priority}>
                          {getPriorityIcon(task.priority)}
                        </div>
                      </div>
                      
                      <h4 className="text-sm font-bold text-white leading-tight mb-2 group-hover:text-[#7C68EE] transition-colors">
                        {task.title}
                      </h4>
                      
                      {task.dueDate && (
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8F96AE] mb-3 font-medium">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-3 text-white/40">
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
                            <div className="h-6 w-6 rounded-full bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-white/30" title="Unassigned">
                              <span className="text-[10px]">?</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Empty Drop Zone */}
                  {columnTasks.length === 0 && (
                    <div className="h-24 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center text-white/30 text-sm font-medium">
                      Drop here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTaskId && (
        <TaskDetailPanel
          taskId={selectedTaskId}
          projectRole={projectRole}
          project={defaultProject}
          onClose={() => setSelectedTaskId(null)}
          onTaskUpdated={fetchTasks}
        />
      )}

      {canCreateTask && (
        <CreateTaskModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          onSuccess={fetchTasks}
          projectId={projectId}
        />
      )}
    </div>
  );
}
