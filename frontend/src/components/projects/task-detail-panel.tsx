'use client';
import * as React from 'react';
import {
  X, MessageSquare, Paperclip, Send, Upload, Trash2,
  Flag, Calendar, Clock, User, Tag, ExternalLink, Loader2, CheckCircle2
} from 'lucide-react';
import { tasksApi, TaskData, TaskCommentData, TaskAttachmentData, ProjectUserRole } from '../../lib/api/tasks.api';
import { ProjectData } from '../../lib/api/projects.api';
import { useAuthStore } from '../../store/auth.store';
import { AppSelect } from '../ui/form-fields';

const PRIORITY_MAP = {
  LOW: { label: 'Low', color: 'bg-green-100 text-green-700' },
  MEDIUM: { label: 'Medium', color: 'bg-blue-100 text-blue-700' },
  HIGH: { label: 'High', color: 'bg-orange-100 text-orange-700' },
  URGENT: { label: 'Urgent', color: 'bg-red-100 text-red-700' },
};

const STATUS_MAP = {
  TODO: { label: 'To Do', color: 'bg-gray-100 text-gray-700' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  IN_REVIEW: { label: 'In Review', color: 'bg-amber-100 text-amber-700' },
  DONE: { label: 'Done', color: 'bg-emerald-100 text-emerald-700' },
};

interface TaskDetailPanelProps {
  taskId: string | null;
  projectRole: ProjectUserRole;
  project: ProjectData;
  onClose: () => void;
  onTaskUpdated: () => void;
}

export function TaskDetailPanel({ taskId, projectRole, project, onClose, onTaskUpdated }: TaskDetailPanelProps) {
  const { user } = useAuthStore();
  const [task, setTask] = React.useState<TaskData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'details' | 'comments' | 'attachments'>('details');

  // Comment state
  const [newComment, setNewComment] = React.useState('');
  const [submittingComment, setSubmittingComment] = React.useState(false);

  // Attachment state
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadingFile, setUploadingFile] = React.useState(false);

  // Field update state
  const [updatingField, setUpdatingField] = React.useState<string | null>(null);

  const canAssign = ['ORG_ADMIN', 'PROJECT_MANAGER', 'TEAM_LEAD'].includes(projectRole);
  const canEditTask = ['ORG_ADMIN', 'PROJECT_MANAGER'].includes(projectRole);

  const fetchTask = React.useCallback(async () => {
    if (!taskId) return;
    setLoading(true);
    try {
      const data = await tasksApi.getTaskById(taskId);
      setTask(data);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  React.useEffect(() => {
    fetchTask();
    setActiveTab('details');
    setNewComment('');
  }, [taskId]);

  const updateField = async (field: string, value: any) => {
    if (!task) return;
    setUpdatingField(field);
    try {
      await tasksApi.updateTask(task.id, { [field]: value });
      setTask((prev) => prev ? { ...prev, [field]: value } : prev);
      onTaskUpdated();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingField(null);
    }
  };

  const submitComment = async () => {
    if (!task || !newComment.trim()) return;
    setSubmittingComment(true);
    try {
      const comment = await tasksApi.addComment(task.id, newComment.trim());
      setTask((prev) => prev ? { ...prev, comments: [...(prev.comments || []), comment] } : prev);
      setNewComment('');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!task || !e.target.files?.length) return;
    const file = e.target.files[0];
    setUploadingFile(true);
    try {
      const attachment = await tasksApi.addAttachment(task.id, file);
      setTask((prev) => prev ? { ...prev, attachments: [...(prev.attachments || []), attachment] } : prev);
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!task) return;
    await tasksApi.deleteAttachment(attachmentId);
    setTask((prev) => prev ? { ...prev, attachments: prev.attachments?.filter(a => a.id !== attachmentId) } : prev);
  };

  if (!taskId) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full z-50 w-full max-w-[520px] bg-white shadow-2xl flex flex-col"
        style={{ borderLeft: '1px solid #e5e7eb' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#F8FAFC] flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              TASK-{task?.id?.split('-')[0].toUpperCase() || '...'}
            </span>
          </div>
          <button onClick={onClose} className="h-7 w-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#7C68EE]" />
          </div>
        ) : task ? (
          <>
            {/* Title */}
            <div className="px-6 pt-5 pb-2 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900 leading-tight">{task.title}</h2>
              {task.description && (
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{task.description}</p>
              )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-6 flex-shrink-0">
              {(['details', 'comments', 'attachments'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 pt-1 mr-6 text-sm font-semibold border-b-2 transition-colors capitalize ${
                    activeTab === tab ? 'border-[#7C68EE] text-[#7C68EE]' : 'border-transparent text-gray-400 hover:text-gray-700'
                  }`}
                >
                  {tab === 'comments' ? `Comments ${task.comments?.length ? `(${task.comments.length})` : ''}` : tab === 'attachments' ? `Attachments ${task.attachments?.length ? `(${task.attachments.length})` : ''}` : 'Details'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto stylish-scrollbar">

              {/* ── Details Tab ── */}
              {activeTab === 'details' && (
                <div className="p-6 space-y-5">
                  {/* Status */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-500 w-28 flex-shrink-0">Status</span>
                    {updatingField === 'status' ? (
                      <Loader2 className="h-4 w-4 animate-spin text-[#7C68EE]" />
                    ) : (
                      <AppSelect
                        value={task.status}
                        onChange={(e) => updateField('status', e.target.value)}
                        className="flex-1 py-1.5 text-xs"
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="IN_REVIEW">In Review</option>
                        <option value="DONE">Done</option>
                      </AppSelect>
                    )}
                  </div>

                  {/* Priority */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-500 w-28 flex-shrink-0">Priority</span>
                    {updatingField === 'priority' ? (
                      <Loader2 className="h-4 w-4 animate-spin text-[#7C68EE]" />
                    ) : (
                      <AppSelect
                        value={task.priority}
                        onChange={(e) => updateField('priority', e.target.value)}
                        className="flex-1 py-1.5 text-xs"
                        disabled={!canAssign}
                      >
                        <option value="LOW">🟢 Low</option>
                        <option value="MEDIUM">🟡 Medium</option>
                        <option value="HIGH">🔴 High</option>
                        <option value="URGENT">🚨 Urgent</option>
                      </AppSelect>
                    )}
                  </div>

                  {/* Assignee */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-500 w-28 flex-shrink-0">Assignee</span>
                    {updatingField === 'assigneeId' ? (
                      <Loader2 className="h-4 w-4 animate-spin text-[#7C68EE]" />
                    ) : canAssign ? (
                      <AppSelect
                        value={task.assigneeId || ''}
                        onChange={(e) => updateField('assigneeId', e.target.value || null)}
                        className="flex-1 py-1.5 text-xs"
                      >
                        <option value="">Unassigned</option>
                        {project.members?.map((m) => (
                          <option key={m.userId} value={m.userId}>{m.user.name}</option>
                        ))}
                      </AppSelect>
                    ) : (
                      <div className="flex items-center gap-2">
                        {task.assignee ? (
                          <>
                            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-[#7C68EE] to-[#4c3ab8] flex items-center justify-center text-white text-[10px] font-bold">
                              {task.assignee.name.charAt(0)}
                            </div>
                            <span className="text-sm text-gray-700">{task.assignee.name}</span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-400">Unassigned</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Due Date */}
                  {task.dueDate && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-500 w-28 flex-shrink-0">Due Date</span>
                      <span className="text-sm text-gray-700">
                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  )}

                  {/* Reporter */}
                  {task.reporter && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-500 w-28 flex-shrink-0">Reporter</span>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-orange-400 flex items-center justify-center text-white text-[10px] font-bold">
                          {task.reporter.name.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-700">{task.reporter.name}</span>
                      </div>
                    </div>
                  )}

                  {/* Estimated Hours */}
                  {task.estimatedHours && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-500 w-28 flex-shrink-0">Est. Hours</span>
                      <span className="text-sm text-gray-700">{task.estimatedHours}h</span>
                    </div>
                  )}

                  {/* Created At */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-500 w-28 flex-shrink-0">Created</span>
                    <span className="text-sm text-gray-400">
                      {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              )}

              {/* ── Comments Tab ── */}
              {activeTab === 'comments' && (
                <div className="p-6 flex flex-col gap-4">
                  {/* Comment List */}
                  <div className="space-y-4">
                    {(task.comments || []).length === 0 && (
                      <div className="text-center py-8">
                        <MessageSquare className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">No comments yet. Be the first!</p>
                      </div>
                    )}
                    {(task.comments || []).map((c) => (
                      <div key={c.id} className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#7C68EE] to-[#4c3ab8] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {c.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-gray-900">{c.user.name}</span>
                            <span className="text-xs text-gray-400">
                              {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl px-4 py-2.5">{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment */}
                  <div className="border-t border-gray-100 pt-4 mt-2">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#7C68EE] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 flex gap-2">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submitComment();
                          }}
                          placeholder="Add a comment... (Ctrl+Enter to send)"
                          style={{ colorScheme: 'light' }}
                          className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#7C68EE] focus:ring-2 focus:ring-[#7C68EE]/20 resize-none min-h-[80px] transition-all"
                        />
                        <button
                          onClick={submitComment}
                          disabled={submittingComment || !newComment.trim()}
                          className="h-9 w-9 mt-auto rounded-xl bg-[#7C68EE] hover:bg-[#6b58dd] disabled:opacity-40 flex items-center justify-center text-white transition-all flex-shrink-0 self-end"
                        >
                          {submittingComment ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Attachments Tab ── */}
              {activeTab === 'attachments' && (
                <div className="p-6 space-y-4">
                  {/* Upload Button */}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingFile}
                      className="w-full border-2 border-dashed border-gray-300 hover:border-[#7C68EE] rounded-2xl py-6 flex flex-col items-center gap-2 text-gray-400 hover:text-[#7C68EE] transition-all group"
                    >
                      {uploadingFile ? (
                        <Loader2 className="h-8 w-8 animate-spin" />
                      ) : (
                        <Upload className="h-8 w-8 group-hover:scale-110 transition-transform" />
                      )}
                      <span className="text-sm font-medium">
                        {uploadingFile ? 'Uploading...' : 'Click to upload a file'}
                      </span>
                      <span className="text-xs">Any file type supported</span>
                    </button>
                  </div>

                  {/* Attachments List */}
                  {(task.attachments || []).length === 0 && !uploadingFile && (
                    <div className="text-center py-6">
                      <Paperclip className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">No attachments yet.</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    {(task.attachments || []).map((a) => (
                      <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors group">
                        <div className="h-10 w-10 rounded-lg bg-[#7C68EE]/10 flex items-center justify-center flex-shrink-0">
                          <Paperclip className="h-4 w-4 text-[#7C68EE]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{a.fileName}</p>
                          <p className="text-xs text-gray-400">
                            {a.fileSize ? `${(a.fileSize / 1024).toFixed(1)} KB • ` : ''}
                            by {a.user.name} · {new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <a
                            href={a.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-7 w-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#7C68EE] transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                          {(a.userId === user?.id || ['ORG_ADMIN', 'PROJECT_MANAGER'].includes(projectRole)) && (
                            <button
                              onClick={() => handleDeleteAttachment(a.id)}
                              className="h-7 w-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
