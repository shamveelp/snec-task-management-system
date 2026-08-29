import * as React from 'react';
import { tasksApi, TaskData, ProjectUserRole } from '../../lib/api/tasks.api';
import { ProjectData } from '../../lib/api/projects.api';
import { Loader2, Plus, MessageSquare, Paperclip, Calendar, Flag } from 'lucide-react';
import { CreateTaskModal } from './create-task-modal';
import { TaskDetailPanel } from './task-detail-panel';

interface KanbanBoardProps {
  projectId: string;
  project: ProjectData;
}

const COLUMNS = [
  { id: 'TODO', title: 'To Do', dot: 'bg-gray-400' },
  { id: 'IN_PROGRESS', title: 'In Progress', dot: 'bg-blue-500' },
  { id: 'IN_REVIEW', title: 'In Review', dot: 'bg-amber-500' },
  { id: 'DONE', title: 'Done', dot: 'bg-emerald-500' },
];

const PRIORITY_COLOR: Record<string, string> = {
  URGENT: 'text-red-500 fill-red-500',
  HIGH: 'text-orange-500 fill-orange-500',
  MEDIUM: 'text-blue-500',
  LOW: 'text-gray-400',
};

export function KanbanBoard({ projectId, project }: KanbanBoardProps) {
  const [tasks, setTasks] = React.useState<TaskData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [projectRole, setProjectRole] = React.useState<ProjectUserRole>('NONE');
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null);
  const [draggedTaskId, setDraggedTaskId] = React.useState<string | null>(null);

  const canCreateTask = ['ORG_ADMIN', 'PROJECT_MANAGER'].includes(projectRole);

  const fetchAll = React.useCallback(async () => {
    try {
      const [tasksData, roleData] = await Promise.all([
        tasksApi.getTasksByProject(projectId),
        tasksApi.getMyProjectRole(projectId),
      ]);
      setTasks(tasksData);
      setProjectRole(roleData);
    } catch (error) {
      console.error('Failed to fetch kanban data', error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  React.useEffect(() => {
    fetchAll();
  }, [projectId]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      if (e.target instanceof HTMLElement) e.target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedTaskId(null);
    if (e.target instanceof HTMLElement) e.target.style.opacity = '1';
  };

  const handleDrop = async (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (!draggedTaskId) return;
    const prev = [...tasks];
    setTasks(tasks.map((t) => (t.id === draggedTaskId ? { ...t, status: status as any } : t)));
    try {
      await tasksApi.updateTask(draggedTaskId, { status });
    } catch {
      setTasks(prev);
    }
    setDraggedTaskId(null);
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
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400 font-medium">{tasks.length} tasks</span>
          {/* Role badge */}
          <span className="text-xs font-bold px-2 py-1 rounded-full bg-[#7C68EE]/10 text-[#7C68EE]">
            {projectRole === 'ORG_ADMIN' ? 'Org Admin' :
             projectRole === 'PROJECT_MANAGER' ? 'Project Manager' :
             projectRole === 'TEAM_LEAD' ? 'Team Lead' :
             projectRole === 'DEVELOPER' ? 'Developer' : 'Viewer'}
          </span>
        </div>
        {canCreateTask && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#7C68EE] hover:bg-[#6b58dd] text-white rounded-lg px-4 h-9 shadow-sm font-medium text-sm transition-all"
          >
            <Plus className="h-4 w-4" /> Add Task
          </button>
        )}
      </div>

      {/* Kanban Canvas */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 stylish-scrollbar">
        <div className="flex h-full gap-6 items-start min-w-max">
          {COLUMNS.map((column) => {
            const columnTasks = tasks.filter((t) => t.status === column.id);
            return (
              <div
                key={column.id}
                className="w-[300px] max-h-full flex flex-col rounded-2xl bg-gray-50/70 border border-gray-100 flex-shrink-0 overflow-hidden"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div className="p-4 flex items-center justify-between border-b border-gray-100 bg-white/60 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${column.dot}`} />
                    <h3 className="font-bold text-gray-800 text-sm">{column.title}</h3>
                  </div>
                  <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5 stylish-scrollbar">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => setSelectedTaskId(task.id)}
                      className="bg-white p-3.5 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-[#7C68EE]/40 hover:shadow-md transition-all group"
                    >
                      {/* Header row */}
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-gray-300 uppercase">
                          {task.id.split('-')[0]}
                        </span>
                        <Flag className={`h-3.5 w-3.5 ${PRIORITY_COLOR[task.priority]}`} />
                      </div>

                      <h4 className="text-sm font-semibold text-gray-900 leading-snug mb-2 group-hover:text-[#7C68EE] transition-colors line-clamp-2">
                        {task.title}
                      </h4>

                      {task.dueDate && (
                        <div className="flex items-center gap-1 text-[11px] text-gray-400 mb-3">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-50">
                        <div className="flex items-center gap-3 text-gray-300">
                          {task._count && task._count.comments > 0 && (
                            <div className="flex items-center gap-1 text-[11px]">
                              <MessageSquare className="h-3 w-3" /> {task._count.comments}
                            </div>
                          )}
                          {task._count && task._count.attachments > 0 && (
                            <div className="flex items-center gap-1 text-[11px]">
                              <Paperclip className="h-3 w-3" /> {task._count.attachments}
                            </div>
                          )}
                        </div>
                        <div>
                          {task.assignee ? (
                            <div
                              className="h-6 w-6 rounded-full bg-gradient-to-tr from-[#7C68EE] to-[#4c3ab8] flex items-center justify-center text-white font-bold text-[9px] shadow-sm overflow-hidden"
                              title={task.assignee.name}
                            >
                              {task.assignee.profilePicture ? (
                                <img src={task.assignee.profilePicture} alt="" className="w-full h-full object-cover" />
                              ) : (
                                task.assignee.name.charAt(0).toUpperCase()
                              )}
                            </div>
                          ) : (
                            <div className="h-6 w-6 rounded-full bg-gray-100 border border-dashed border-gray-200 flex items-center justify-center text-gray-300" title="Unassigned">
                              <span className="text-[10px]">?</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="h-20 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 text-xs font-medium">
                      Drop tasks here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Detail Panel */}
      <TaskDetailPanel
        taskId={selectedTaskId}
        projectRole={projectRole}
        project={project}
        onClose={() => setSelectedTaskId(null)}
        onTaskUpdated={fetchAll}
      />

      {/* Create Task Modal */}
      {canCreateTask && (
        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={fetchAll}
          projectId={projectId}
        />
      )}
    </div>
  );
}
