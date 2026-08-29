"use client";

import * as React from "react";
import { useAuthStore } from "../../../../store/auth.store";
import { Button } from "../../../../components/ui/button";
import { Plus, Search, MoreHorizontal, Loader2, LayoutGrid, Calendar, Users, Target, Flag } from "lucide-react";
import { projectsService, ProjectData } from "../../../../services/organization/projects.service";
import { CreateProjectModal } from "../../../../components/projects/create-project-modal";
import { useRouter } from "next/navigation";

export default function OrganizationProjectsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  
  const [projects, setProjects] = React.useState<ProjectData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectsService.getOrganizationProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(
    p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'HIGH': return 'bg-red-50 text-red-600 border-red-200';
      case 'MEDIUM': return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'LOW': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'ACTIVE': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'ON_HOLD': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'PLANNING': return 'bg-purple-50 text-purple-600 border-purple-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col h-full px-10 pb-10 gap-8 bg-white overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center mt-2 flex-shrink-0">
        <div>
          <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and oversee all projects in your organization.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#7C68EE] hover:bg-[#6b58dd] text-white rounded-[14px] px-6 py-5 h-auto shadow-sm font-medium"
          >
            <Plus className="h-5 w-5 mr-2" /> New Project
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0 bg-[#F8FAFC] p-2 rounded-2xl border border-gray-100">
        <div className="flex items-center gap-2 px-2">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <LayoutGrid className="h-4 w-4 text-[#7C68EE]" /> All Projects ({projects.length})
          </div>
        </div>

        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ colorScheme: 'light' }}
            className="w-full sm:w-72 pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#7C68EE] focus:border-[#7C68EE] outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
        {loading ? (
          <div className="flex-1 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#7C68EE]" />
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-auto stylish-scrollbar flex-1 relative">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-[#F8FAFC] sticky top-0 z-10 border-b border-gray-200">
                <tr>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider w-[300px]">Project Details</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Timeline</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Team</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProjects.map(project => (
                  <tr 
                    key={project.id} 
                    className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                    onClick={() => router.push(`/organization/projects/${project.id}`)}
                  >
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-bold text-gray-900 text-sm group-hover:text-[#7C68EE] transition-colors">{project.name}</div>
                        <div className="text-gray-500 text-xs mt-1 line-clamp-1">{project.description || 'No description provided.'}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-bold ${getStatusBadge(project.status)}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-bold ${getPriorityBadge(project.priority)}`}>
                        <Flag className="h-3 w-3 mr-1.5" />
                        {project.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-xs text-gray-600">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                          <span className="text-gray-400 mr-1">Start:</span> {formatDate(project.startDate)}
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <Target className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                          <span className="text-gray-400 mr-1">End:</span> {formatDate(project.endDate)}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {project.members?.map((member, i) => (
                            <div key={member.id} className="h-8 w-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-[10px] z-[3] shadow-sm overflow-hidden relative" style={{ zIndex: 10 - i }}>
                              {member.user.profilePicture ? (
                                <img src={member.user.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                member.user.name.charAt(0).toUpperCase()
                              )}
                            </div>
                          ))}
                        </div>
                        {project._count && project._count.members > 5 && (
                          <div className="text-xs font-bold text-gray-500">+{project._count.members - 5} more</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty States */}
            {filteredProjects.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center h-full absolute inset-0">
                <LayoutGrid className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No projects found</h3>
                <p className="text-sm text-gray-500 mt-1">Create a new project to get started.</p>
                <Button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-6 bg-[#7C68EE] hover:bg-[#6b58dd] text-white rounded-[14px] px-6 py-5 shadow-sm font-medium"
                >
                  <Plus className="h-5 w-5 mr-2" /> Create First Project
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <CreateProjectModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={fetchProjects} 
      />
    </div>
  );
}
