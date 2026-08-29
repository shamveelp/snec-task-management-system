"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { projectsService, ProjectData } from "../../../../../services/organization/projects.service";
import { Loader2, ArrowLeft, LayoutGrid, Users } from "lucide-react";
import { KanbanBoardDark } from "@/components/projects/kanban-board-dark";

export default function UserProjectDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [project, setProject] = React.useState<ProjectData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectsService.getProjectById(id);
        setProject(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#131417]">
        <Loader2 className="h-8 w-8 animate-spin text-[#7C68EE]" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-[#131417] gap-4">
        <h2 className="text-xl font-bold text-white">Project Not Found</h2>
        <button onClick={() => router.back()} className="text-[#7C68EE] hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-[#131417] overflow-hidden">
      {/* Header */}
      <div className="px-10 py-6 pt-20 border-b border-white/[0.04] flex-shrink-0 bg-[#0D0E12]">
        <button 
          onClick={() => router.push('/dashboard/projects')}
          className="flex items-center text-sm font-medium text-[#8F96AE] hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to My Projects
        </button>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-[28px] font-bold text-white tracking-tight">{project.name}</h1>
            <p className="text-sm text-[#8F96AE] mt-1 max-w-2xl">{project.description || "No description provided."}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mt-8">
          <button 
            className={`flex items-center gap-2 pb-3 font-medium transition-colors border-b-2 border-[#7C68EE] text-white`}
          >
            <LayoutGrid className="h-4 w-4" /> Board
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <KanbanBoardDark projectId={project.id} project={project} />
      </div>
    </div>
  );
}
