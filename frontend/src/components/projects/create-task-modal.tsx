'use client';
import * as React from 'react';
import { X, Loader2, Calendar as CalendarIcon, Target, Flag, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { AppInput, AppSelect, AppDatePicker } from '../ui/form-fields';
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
    estimatedHours: undefined,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] rounded-3xl"
        style={{ animation: 'modal-pop 0.2s cubic-bezier(0.34,1.56,0.64,1)' }}>
        <style>{`
          @keyframes modal-pop {
            from { opacity: 0; transform: scale(0.92) translateY(12px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        {/* Gradient Header */}
        <div
          className="px-8 py-7 flex justify-between items-start flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #0f2335 0%, #1a3a5c 50%, #0d1f35 100%)' }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#60a5fa] text-xs font-bold uppercase tracking-widest">Add Task</span>
            </div>
            <h2 className="text-2xl font-bold text-white leading-tight">Create Task</h2>
            <p className="text-[#8ba3c7] text-sm mt-1">Add a new actionable item to the project.</p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center transition-colors mt-1"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <X className="h-4 w-4 text-white/70" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto stylish-scrollbar p-8 bg-white">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Title */}
            <AppInput
              label="Title *"
              placeholder="e.g. Implement authentication"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Description</label>
              <textarea
                placeholder="Details about the task..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ colorScheme: 'light' }}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#7C68EE] focus:ring-2 focus:ring-[#7C68EE]/20 min-h-[90px] resize-none"
              />
            </div>

            {/* Assignee & Status */}
            <div className="grid grid-cols-2 gap-4">
              <AppSelect
                label="Assignee"
                value={formData.assigneeId}
                onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
              >
                <option value="">Unassigned</option>
                {project?.members?.map((m) => (
                  <option key={m.userId} value={m.userId}>{m.user.name}</option>
                ))}
              </AppSelect>

              <AppSelect
                label="Status"
                icon={<Target className="h-4 w-4" />}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="DONE">Done</option>
              </AppSelect>
            </div>

            {/* Priority, Due Date, Estimated Hours */}
            <div className="grid grid-cols-3 gap-4">
              <AppSelect
                label="Priority"
                icon={<Flag className="h-4 w-4" />}
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </AppSelect>

              <AppDatePicker
                label="Due Date"
                value={formData.dueDate || ''}
                onChange={(v) => setFormData({ ...formData, dueDate: v })}
                placeholder="Pick due date"
              />

              <AppInput
                label="Est. Hours"
                type="number"
                min="0"
                step="0.5"
                placeholder="e.g. 4.5"
                value={formData.estimatedHours || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedHours: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 py-5 flex justify-end gap-3 flex-shrink-0"
          style={{ background: '#f8f9fc', borderTop: '1px solid #e5e7eb' }}>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all disabled:opacity-60"
            style={{
              background: loading ? '#1a3a5c' : 'linear-gradient(135deg, #1a3a5c 0%, #0f2335 100%)',
              boxShadow: '0 4px 15px rgba(26,58,92,0.4)',
            }}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Saving...' : '✦ Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
