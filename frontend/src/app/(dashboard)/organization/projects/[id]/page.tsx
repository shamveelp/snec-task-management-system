"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { projectsApi, ProjectData } from "@/lib/api/projects.api";
import { Loader2, ArrowLeft, LayoutGrid, Users, Settings } from "lucide-react";
import { KanbanBoard } from "@/components/projects/kanban-board";
import { ProjectMembers } from "@/components/projects/project-members";

export default function ProjectDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [project, setProject] = React.useState<ProjectData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'board' | 'members' | 'settings'>('board');

  const fetchProject = async () => {
    try {
      setLoading(true);
      const data = await projectsApi.getProjectById(id);
      setProject(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#7C68EE]" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-white gap-4">
        <h2 className="text-xl font-bold text-gray-900">Project Not Found</h2>
        <button onClick={() => router.back()} className="text-[#7C68EE] hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 flex-shrink-0 bg-[#F8FAFC]">
        <button 
          onClick={() => router.push('/organization/projects')}
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Projects
        </button>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">{project.name}</h1>
            <p className="text-sm text-gray-500 mt-1 max-w-2xl">{project.description || "No description provided."}</p>
          </div>
          <div className="flex gap-2">
             {/* Additional actions can go here */}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mt-8">
          <button 
            onClick={() => setActiveTab('board')}
            className={`flex items-center gap-2 pb-3 font-medium transition-colors border-b-2 ${activeTab === 'board' ? 'border-[#7C68EE] text-[#7C68EE]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
          >
            <LayoutGrid className="h-4 w-4" /> Board
          </button>
          <button 
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-2 pb-3 font-medium transition-colors border-b-2 ${activeTab === 'members' ? 'border-[#7C68EE] text-[#7C68EE]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
          >
            <Users className="h-4 w-4" /> Members
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 pb-3 font-medium transition-colors border-b-2 ${activeTab === 'settings' ? 'border-[#7C68EE] text-[#7C68EE]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
          >
            <Settings className="h-4 w-4" /> Settings
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'board' && <KanbanBoard projectId={project.id} project={project} />}
        {activeTab === 'members' && <ProjectMembers project={project} onUpdate={fetchProject} />}
        {activeTab === 'settings' && (
          <div className="p-8">
            <h3 className="text-lg font-bold">Project Settings</h3>
            <p className="text-gray-500 mt-2">Edit project details here. (Coming soon)</p>
          </div>
        )}
      </div>
    </div>
  );
}
