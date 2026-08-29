import * as React from 'react';
import { X, Loader2, Calendar as CalendarIcon, Target, Flag, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { tasksApi, CreateTaskPayload } from '../../lib/api/tasks.api';
import { projectsApi, ProjectData } from '../../lib/api/projects.api';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: string;
}

export function CreateTaskModal({ isOpen, onClose, onSuccess, projectId }: CreateTaskModalProps) {
  const [formData, setFormData] = React.useState<CreateTaskPayload>({
    title: '',
    description: '',
    projectId: projectId,
    assigneeId: '',
    priority: 'MEDIUM',
    status: 'TODO',
    dueDate: '',
    estimatedHours: undefined
  });
  
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [project, setProject] = React.useState<ProjectData | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      projectsApi.getProjectById(projectId).then(setProject).catch(console.error);
    }
  }, [isOpen, projectId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const payload = { ...formData, projectId };
      if (!payload.assigneeId) delete payload.assigneeId;
      if (!payload.dueDate) delete payload.dueDate;
      if (!payload.estimatedHours) delete payload.estimatedHours;
      else payload.estimatedHours = Number(payload.estimatedHours);

      await tasksApi.createTask(payload);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-[#F8FAFC]">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create Task</h2>
            <p className="text-sm text-gray-500 mt-1">Add a new actionable item to the project.</p>
          </div>
          <button 
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto stylish-scrollbar p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Title *</label>
              <input
                type="text"
                placeholder="e.g. Implement authentication"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7C68EE] focus:border-[#7C68EE] outline-none transition-all placeholder:text-gray-400"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
              <textarea
                placeholder="Details about the task..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7C68EE] focus:border-[#7C68EE] outline-none transition-all placeholder:text-gray-400 min-h-[100px] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Assignee */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Assignee</label>
                <select
                  value={formData.assigneeId}
                  onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7C68EE] outline-none transition-all text-gray-900 appearance-none font-medium"
                >
                  <option value="">Unassigned</option>
                  {project?.members?.map(m => (
                    <option key={m.userId} value={m.userId}>{m.user.name}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4 text-gray-400" /> Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7C68EE] outline-none transition-all text-gray-900 appearance-none font-medium"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Priority */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Flag className="h-4 w-4 text-gray-400" /> Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7C68EE] outline-none transition-all text-gray-900 appearance-none font-medium"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-gray-400" /> Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7C68EE] outline-none transition-all text-gray-700"
                />
              </div>

              {/* Estimated Hours */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" /> Est. Hours
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.estimatedHours || ''}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7C68EE] outline-none transition-all text-gray-700"
                  placeholder="e.g. 4.5"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 bg-[#F8FAFC] flex justify-end gap-3">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="rounded-xl px-6 font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#7C68EE] hover:bg-[#6b58dd] text-white rounded-xl px-8 shadow-sm font-medium transition-all"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
            {loading ? 'Saving...' : 'Create Task'}
          </Button>
        </div>

      </div>
    </div>
  );
}
