import * as React from 'react';
import { ProjectData, projectsApi, ProjectMemberData } from '../../lib/api/projects.api';
import { organizationsApi } from '../../lib/api/organizations.api';
import { Loader2, Plus, UserX, Search, UserPlus, Shield, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import { Button } from '../ui/button';
import { AppInput, AppSelect } from '../ui/form-fields';
import { useAuthStore } from '../../store/auth.store';
import { useRouter } from 'next/navigation';
import { tasksApi, ProjectUserRole } from '../../lib/api/tasks.api';

interface ProjectMembersProps {
  project: ProjectData;
  onUpdate: () => void;
}

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  PROJECT_MANAGER: { label: 'Project Manager', color: 'bg-purple-100 text-purple-700' },
  TEAM_LEAD: { label: 'Team Lead', color: 'bg-blue-100 text-blue-700' },
  DEVELOPER: { label: 'Developer', color: 'bg-green-100 text-green-700' },
};

export function ProjectMembers({ project, onUpdate }: ProjectMembersProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [orgMembers, setOrgMembers] = React.useState<any[]>([]);
  const [projectRole, setProjectRole] = React.useState<ProjectUserRole>('NONE');
  const [loading, setLoading] = React.useState(true);

  // Add member form
  const [memberSearch, setMemberSearch] = React.useState('');
  const [selectedUserId, setSelectedUserId] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState('DEVELOPER');
  const [adding, setAdding] = React.useState(false);
  const [addError, setAddError] = React.useState('');

  // Existing members search/sort
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortField, setSortField] = React.useState<'name' | 'role'>('name');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');

  const isOrgAdmin = user?.role?.name === 'Organization Admin';
  // Who can manage roles: Org Admin or Project Manager
  const canManageRoles = isOrgAdmin || projectRole === 'PROJECT_MANAGER';
  // Project Manager can only assign DEVELOPER or TEAM_LEAD (not PROJECT_MANAGER)
  const allowedRolesToAssign = isOrgAdmin
    ? ['PROJECT_MANAGER', 'TEAM_LEAD', 'DEVELOPER']
    : projectRole === 'PROJECT_MANAGER'
    ? ['DEVELOPER', 'TEAM_LEAD']
    : [];

  React.useEffect(() => {
    const init = async () => {
      try {
        const [members, role] = await Promise.all([
          organizationsApi.getMembers(),
          tasksApi.getMyProjectRole(project.id),
        ]);
        setOrgMembers(members);
        setProjectRole(role);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [project.id]);

  // Org members not yet in the project
  const projectMemberIds = new Set(project.members?.map((m) => m.userId) || []);
  const filteredOrgMembers = orgMembers.filter((m) => {
    const notInProject = !projectMemberIds.has(m.id);
    const matchSearch = !memberSearch || m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.email.toLowerCase().includes(memberSearch.toLowerCase());
    return notInProject && matchSearch;
  });

  // Existing project members with search+sort
  const sortedMembers = React.useMemo(() => {
    const members = (project.members || []).filter((m) => {
      if (!searchQuery) return true;
      return (
        m.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    return [...members].sort((a, b) => {
      const aVal = sortField === 'name' ? a.user.name : a.role;
      const bVal = sortField === 'name' ? b.user.name : b.role;
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [project.members, searchQuery, sortField, sortDir]);

  const toggleSort = (field: 'name' | 'role') => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('asc'); }
  };

  const SortIcon = ({ field }: { field: 'name' | 'role' }) =>
    sortField === field
      ? sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
      : <ArrowUpDown className="h-3 w-3 opacity-30" />;

  const handleAddMember = async () => {
    if (!selectedUserId) { setAddError('Please select a member'); return; }
    setAdding(true);
    setAddError('');
    try {
      await projectsApi.addMember(project.id, selectedUserId, selectedRole);
      setSelectedUserId('');
      setMemberSearch('');
      onUpdate();
    } catch (err: any) {
      setAddError(err.response?.data?.message || 'Failed to add member');
    } finally {
      setAdding(false);
    }
  };

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      await projectsApi.updateMemberRole(project.id, userId, role);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Remove this member from the project?')) return;
    try {
      await projectsApi.removeMember(project.id, userId);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#7C68EE]" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 overflow-y-auto h-full stylish-scrollbar bg-[#F8FAFC]">

      {/* ── Add Member Section ── (only if canManageRoles) */}
      {canManageRoles && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Add Project Member</h2>
              <p className="text-sm text-gray-400 mt-0.5">Select from organization members and assign a role.</p>
            </div>
            {/* Invite to org shortcut */}
            <button
              onClick={() => router.push('/organization/team')}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#7C68EE] hover:text-[#6b58dd] transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              Invite to Organization
            </button>
          </div>

          {addError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{addError}</div>
          )}

          {/* Row: Search → Select → Role → Add */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Member search input */}
            <div className="flex-1">
              <AppInput
                placeholder="Search organization members..."
                icon={<Search className="h-4 w-4" />}
                value={memberSearch}
                onChange={(e) => {
                  setMemberSearch(e.target.value);
                  setSelectedUserId('');
                }}
              />
            </div>

            {/* Member dropdown */}
            <AppSelect
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="sm:w-56"
            >
              <option value="">Select member...</option>
              {filteredOrgMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </AppSelect>

            {/* Role dropdown */}
            <AppSelect
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="sm:w-48"
            >
              {allowedRolesToAssign.map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]?.label}</option>
              ))}
            </AppSelect>

            <button
              onClick={handleAddMember}
              disabled={adding || !selectedUserId}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition-all flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #7C68EE 0%, #5b45d4 100%)' }}
            >
              {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add
            </button>
          </div>

          {filteredOrgMembers.length === 0 && memberSearch && (
            <p className="text-sm text-gray-400 mt-3">No matching org members available to add.</p>
          )}
        </div>
      )}

      {/* ── Members Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Project Members</h2>
            <p className="text-sm text-gray-400">{project.members?.length || 0} member(s)</p>
          </div>
          {/* Search existing members */}
          <div className="w-full sm:w-72">
            <AppInput
              placeholder="Search members..."
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left">
                  <button
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-gray-900 transition-colors"
                    onClick={() => toggleSort('name')}
                  >
                    Member <SortIcon field="name" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-gray-900 transition-colors"
                    onClick={() => toggleSort('role')}
                  >
                    Project Role <SortIcon field="role" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                {canManageRoles && (
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sortedMembers.map((member) => (
                <tr key={member.userId} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#7C68EE] to-[#4c3ab8] flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0">
                        {member.user.profilePicture ? (
                          <img src={member.user.profilePicture} alt="" className="w-full h-full object-cover" />
                        ) : (
                          member.user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{member.user.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {canManageRoles && member.userId !== user?.id ? (
                      <select
                        value={member.role}
                        onChange={(e) => handleUpdateRole(member.userId, e.target.value)}
                        style={{ colorScheme: 'light' }}
                        className="bg-white border border-gray-200 text-sm font-semibold text-gray-700 cursor-pointer rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-[#7C68EE] outline-none"
                      >
                        {allowedRolesToAssign.map((r) => (
                          <option key={r} value={r}>{ROLE_LABELS[r]?.label}</option>
                        ))}
                        {/* Always show current role even if not in allowed list */}
                        {!allowedRolesToAssign.includes(member.role) && (
                          <option value={member.role}>{ROLE_LABELS[member.role]?.label}</option>
                        )}
                      </select>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${ROLE_LABELS[member.role]?.color || 'bg-gray-100 text-gray-600'}`}>
                        {ROLE_LABELS[member.role]?.label || member.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{member.user.email}</span>
                  </td>
                  {canManageRoles && (
                    <td className="px-6 py-4 text-right">
                      {member.userId !== user?.id && (
                        <button
                          onClick={() => handleRemoveMember(member.userId)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
                        >
                          <UserX className="h-3.5 w-3.5" /> Remove
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {sortedMembers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-sm">
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
