"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { projectsService, ProjectData } from "../../../../services/organization/projects.service";
import { Loader2, LayoutGrid, Calendar, Users, Target, Flag } from "lucide-react";

export default function MyProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = React.useState<ProjectData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsService.getMyProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'HIGH': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'MEDIUM': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'LOW': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-white/5 text-gray-400 border-white/10';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'ACTIVE': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'ON_HOLD': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'PLANNING': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-white/5 text-gray-400 border-white/10';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center bg-[#131417]">
        <Loader2 className="h-8 w-8 animate-spin text-[#7C68EE]" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-10 overflow-hidden bg-[#131417]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">My Projects</h1>
        <p className="text-[#8F96AE] mt-2">Projects you are a member of.</p>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto stylish-scrollbar pb-10">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center h-full">
            <LayoutGrid className="h-12 w-12 text-white/20 mb-4" />
            <h3 className="text-lg font-bold text-white">No projects found</h3>
            <p className="text-sm text-[#8F96AE] mt-1">You haven't been assigned to any projects yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <div 
                key={project.id}
                onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                className="bg-[#1C1E24] border border-white/5 hover:border-white/20 rounded-2xl p-6 cursor-pointer group transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(project.status)}`}>
                    {project.status.replace('_', ' ')}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getPriorityBadge(project.priority)}`}>
                    {project.priority}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#7C68EE] transition-colors line-clamp-1">{project.name}</h3>
                <p className="text-sm text-[#8F96AE] line-clamp-2 mb-6 h-10">{project.description || 'No description provided.'}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-[10px] font-bold text-[#8F96AE] uppercase mb-1">Start Date</div>
                    <div className="text-sm text-white font-medium flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-white/40" /> {formatDate(project.startDate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#8F96AE] uppercase mb-1">End Date</div>
                    <div className="text-sm text-white font-medium flex items-center gap-1.5">
                      <Target className="h-3 w-3 text-white/40" /> {formatDate(project.endDate)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-sm text-[#8F96AE]">
                    <Users className="h-4 w-4" /> {project._count?.members || 0} Members
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#8F96AE]">
                    <LayoutGrid className="h-4 w-4" /> {project._count?.tasks || 0} Tasks
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
