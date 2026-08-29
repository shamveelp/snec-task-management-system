'use client';
import * as React from 'react';
import { X, Loader2, Flag, Target, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { AppInput, AppSelect, AppDatePicker } from '../ui/form-fields';
import { projectsApi, CreateProjectPayload } from '../../lib/api/projects.api';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: '🟢 Low Priority' },
  { value: 'MEDIUM', label: '🟡 Medium Priority' },
  { value: 'HIGH', label: '🔴 High Priority' },
  { value: 'URGENT', label: '🚨 Urgent' },
];

const STATUS_OPTIONS = [
  { value: 'PLANNING', label: '📋 Planning' },
  { value: 'ACTIVE', label: '🚀 Active' },
  { value: 'ON_HOLD', label: '⏸️ On Hold' },
  { value: 'COMPLETED', label: '✅ Completed' },
];

export function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
  const [formData, setFormData] = React.useState<CreateProjectPayload>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    priority: 'MEDIUM',
    status: 'PLANNING',
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const resetForm = () => {
    setFormData({ name: '', description: '', startDate: '', endDate: '', priority: 'MEDIUM', status: 'PLANNING' });
    setError('');
  };

  if (!isOpen) return null;

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = { ...formData };
      if (!payload.startDate) delete payload.startDate;
      if (!payload.endDate) delete payload.endDate;
      await projectsApi.createProject(payload);
      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div
        className="w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] rounded-3xl"
        style={{ animation: 'modal-pop 0.2s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        <style>{`
          @keyframes modal-pop {
            from { opacity: 0; transform: scale(0.92) translateY(12px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        {/* ── Gradient Header ── */}
        <div
          className="px-8 py-7 flex justify-between items-start flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #1a1035 0%, #2d1b69 50%, #0f2b4a 100%)',
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-[#a78bfa]" />
              <span className="text-[#a78bfa] text-xs font-bold uppercase tracking-widest">New Project</span>
            </div>
            <h2 className="text-2xl font-bold text-white leading-tight">Create a Project</h2>
            <p className="text-[#8ba3c7] text-sm mt-1">Set up a new workspace for your team.</p>
          </div>
          <button
            onClick={handleClose}
            className="h-8 w-8 rounded-full flex items-center justify-center transition-colors mt-1"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <X className="h-4 w-4 text-white/70" />
          </button>
        </div>

        {/* ── Body ── */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto stylish-scrollbar p-8 bg-white"
        >
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Project Name */}
            <AppInput
              label="Project Name *"
              placeholder="e.g. Q4 Marketing Campaign"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Description</label>
              <textarea
                placeholder="What is this project about?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ colorScheme: 'light' }}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#7C68EE] focus:ring-2 focus:ring-[#7C68EE]/20 min-h-[90px] resize-none"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <AppDatePicker
                label="Start Date"
                value={formData.startDate || ''}
                onChange={(v) => setFormData({ ...formData, startDate: v })}
                placeholder="Pick start date"
              />
              <AppDatePicker
                label="End Date"
                value={formData.endDate || ''}
                onChange={(v) => setFormData({ ...formData, endDate: v })}
                placeholder="Pick end date"
                min={formData.startDate || undefined}
              />
            </div>

            {/* Priority & Status */}
            <div className="grid grid-cols-2 gap-4">
              <AppSelect
                label="Priority"
                icon={<Flag className="h-4 w-4" />}
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                {PRIORITY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </AppSelect>

              <AppSelect
                label="Status"
                icon={<Target className="h-4 w-4" />}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </AppSelect>
            </div>
          </div>
        </form>

        {/* ── Footer ── */}
        <div
          className="px-8 py-5 flex justify-end gap-3 flex-shrink-0"
          style={{ background: '#f8f9fc', borderTop: '1px solid #e5e7eb' }}
        >
          <button
            type="button"
            onClick={handleClose}
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
              background: loading
                ? '#6b58dd'
                : 'linear-gradient(135deg, #7C68EE 0%, #5b45d4 100%)',
              boxShadow: '0 4px 15px rgba(124,104,238,0.4)',
            }}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Creating...' : '✦ Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
}
