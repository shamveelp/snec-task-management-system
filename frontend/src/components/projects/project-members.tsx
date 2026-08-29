import * as React from "react";
import { ProjectData, projectsApi } from "../../lib/api/projects.api";
import { organizationsApi, OrganizationMember } from "../../lib/api/organizations.api";
import { Loader2, Plus, UserX, Shield } from "lucide-react";
import { Button } from "../ui/button";
import { AppInput, AppSelect } from "../ui/form-fields";
import { useAuthStore } from "../../store/auth.store";

interface ProjectMembersProps {
  project: ProjectData;
  onUpdate: () => void;
}

export function ProjectMembers({ project, onUpdate }: ProjectMembersProps) {
  const { user } = useAuthStore();
  const [orgMembers, setOrgMembers] = React.useState<OrganizationMember[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isAdding, setIsAdding] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState("DEVELOPER");
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    const fetchOrgMembers = async () => {
      try {
        const members = await organizationsApi.getMembers();
        setOrgMembers(members);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrgMembers();
  }, []);

  const handleAddMember = async () => {
    if (!selectedUser) return;
    setIsAdding(true);
    try {
      await projectsApi.addMember(project.id, selectedUser, selectedRole);
      onUpdate();
      setSelectedUser("");
      setSelectedRole("DEVELOPER");
    } catch (error) {
      console.error(error);
      alert("Failed to add member");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      await projectsApi.removeMember(project.id, userId);
      onUpdate();
    } catch (error) {
      console.error(error);
      alert("Failed to remove member");
    }
  };

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      await projectsApi.updateMemberRole(project.id, userId, role);
      onUpdate();
    } catch (error) {
      console.error(error);
      alert("Failed to update role");
    }
  };

  const availableMembers = orgMembers.filter(
    (orgM) => !project.members?.find((pm) => pm.user.id === orgM.id) && 
              (orgM.name.toLowerCase().includes(searchQuery.toLowerCase()) || orgM.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <div className="p-8 max-w-5xl mx-auto w-full flex-1">
        
        {/* Add Member Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Add Project Member</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <AppInput
                placeholder="Search organization members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <AppSelect
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="sm:w-64"
            >
              <option value="">Select a member...</option>
              {availableMembers.map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
              ))}
            </AppSelect>

            <AppSelect
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="sm:w-48"
            >
              <option value="DEVELOPER">Developer</option>
              <option value="TEAM_LEAD">Team Lead</option>
              <option value="PROJECT_MANAGER">Project Manager</option>
            </AppSelect>

            <Button 
              onClick={handleAddMember} 
              disabled={!selectedUser || isAdding}
              className="bg-[#7C68EE] hover:bg-[#6b58dd] text-white rounded-xl px-6 h-auto"
            >
              {isAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Add
            </Button>
          </div>
        </div>

        {/* Members List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8FAFC] border-b border-gray-100">
              <tr>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Member</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Project Role</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {project.members?.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#7C68EE] to-[#4c3ab8] flex items-center justify-center text-white font-bold text-sm shadow-sm overflow-hidden">
                        {member.user.profilePicture ? (
                          <img src={member.user.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          member.user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{member.user.name}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{member.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      <select
                        value={member.role}
                        onChange={(e) => handleUpdateRole(member.user.id, e.target.value)}
                        style={{ colorScheme: 'light' }}
                        className="bg-white border border-gray-200 text-sm font-semibold text-gray-700 cursor-pointer rounded-lg px-2 py-1 focus:ring-2 focus:ring-[#7C68EE] outline-none"
                      >
                        <option value="DEVELOPER">Developer</option>
                        <option value="TEAM_LEAD">Team Lead</option>
                        <option value="PROJECT_MANAGER">Project Manager</option>
                      </select>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => handleRemoveMember(member.user.id)}
                      className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove Member"
                    >
                      <UserX className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!project.members || project.members.length === 0) && (
            <div className="py-12 text-center text-gray-500 text-sm">
              No members added to this project yet.
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
