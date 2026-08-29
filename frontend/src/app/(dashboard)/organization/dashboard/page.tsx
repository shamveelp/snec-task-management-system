"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../../../store/auth.store";
import { Button } from "../../../../components/ui/button";
import { 
  CloudUpload, Grid, List, MoreVertical, Plus, Share2, 
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Folder, Calendar
} from "lucide-react";
import { cn } from "../../../../lib/utils";
import { organizationsService } from "../../../../services/organization/organizations.service";

const PROJECT_COLORS = [
  { bg: "bg-[#FF6B6B]", shadow: "shadow-[0_20px_40px_-15px_rgba(255,107,107,0.7)]" },
  { bg: "bg-[#7C68EE]", shadow: "shadow-[0_20px_40px_-15px_rgba(124,104,238,0.7)]" },
  { bg: "bg-[#FFB84C]", shadow: "shadow-[0_20px_40px_-15px_rgba(255,184,76,0.7)]" },
  { bg: "bg-[#34D399]", shadow: "shadow-[0_20px_40px_-15px_rgba(52,211,153,0.7)]" }
];

const TASK_COLORS = [
  { bg: "bg-[#FF6B6B]", text: "PDF" },
  { bg: "bg-[#FFB84C]", text: "DOC" },
  { bg: "bg-[#34D399]", text: "ZIP" },
  { bg: "bg-[#7C68EE]", text: "TXT" }
];

export default function OrganizationDashboardPage() {
  const { user } = useAuthStore();
  const userName = user?.name?.split(' ')[0] || 'User';

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await organizationsService.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading dashboard...</div>;
  }

  const { recentProjects = [], recentTasks = [], yourUpcomingTask, storageInfo } = dashboardData || {};

  return (
    <div className="flex flex-col xl:flex-row h-full px-10 pb-10 gap-10 bg-white">
      
      {/* Main Content Column */}
      <div className="flex-1 space-y-10 overflow-y-auto pr-2 stylish-scrollbar">
        
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mt-2">
          <h1 className="text-[22px] font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-900 transition-colors">
              <Grid className="h-5 w-5" />
            </button>
            <button className="text-gray-400 hover:text-gray-900 transition-colors">
              <List className="h-5 w-5" />
            </button>
            <Button className="bg-[#7C68EE] hover:bg-[#6b58dd] text-white rounded-[14px] px-5 py-5 h-auto ml-2 shadow-sm font-medium">
              Upload File <CloudUpload className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        

        {/* Folders (Recent Projects) */}
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="text-[17px] font-bold text-gray-900">Recent Projects</h3>
            <button className="text-gray-400 hover:text-gray-900 text-sm font-medium flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentProjects.length === 0 ? (
              <div className="col-span-3 text-sm text-gray-400 p-4 border border-dashed rounded-xl text-center">No projects available</div>
            ) : (
              recentProjects.map((project: any, index: number) => {
                const colors = PROJECT_COLORS[index % PROJECT_COLORS.length];
                const members = project.members || [];
                const maxDisplay = 3;
                const extra = members.length > maxDisplay ? members.length - maxDisplay : 0;
                
                return (
                  <div key={project.id} className={cn(colors.bg, "rounded-[24px] p-6 text-white flex flex-col justify-between h-[180px]", colors.shadow)}>
                    <div className="flex justify-between items-start">
                      <div className="bg-white/20 p-2 rounded-xl">
                        <Folder className="h-5 w-5 text-white fill-white" />
                      </div>
                      <MoreVertical className="h-5 w-5 text-white/80 cursor-pointer" />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-semibold mb-3 text-white truncate" title={project.name}>{project.name}</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {members.slice(0, maxDisplay).map((m: any) => (
                            <img key={m.id} src={m.user.profilePicture || "https://ui-avatars.com/api/?name=" + encodeURIComponent(m.user.name)} className={cn("h-6 w-6 rounded-full border-2", `border-[${colors.bg.replace('bg-[', '').replace(']', '')}]`)} />
                          ))}
                          {extra > 0 && (
                            <div className={cn("h-6 w-6 rounded-full bg-white text-[9px] font-bold flex items-center justify-center border-2", `text-[${colors.bg.replace('bg-[', '').replace(']', '')}] border-[${colors.bg.replace('bg-[', '').replace(']', '')}]`)}>+{extra}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="text-[11px] text-white/90">{project._count?.tasks || 0} Tasks</div>
                        <div className="text-[11px] text-white/90">Created {formatDate(project.createdAt)}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Files (Recent Tasks) */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-[17px] font-bold text-gray-900">Recent Tasks</h3>
            <button className="text-gray-400 hover:text-gray-900 text-sm font-medium flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="space-y-3 pb-8">
            {recentTasks.length === 0 ? (
              <div className="text-sm text-gray-400 p-4 border border-dashed rounded-xl text-center">No tasks available</div>
            ) : (
              recentTasks.map((task: any, index: number) => {
                const color = TASK_COLORS[index % TASK_COLORS.length];
                // Make the second item (index 1) active style just for visual variety if needed, or keep them uniform
                const isActive = index === 1 && recentTasks.length > 1;
                
                return (
                  <div key={task.id} className={cn(
                    "flex items-center justify-between p-4 rounded-[20px] transition-all cursor-pointer",
                    isActive ? "bg-[#7C68EE] text-white shadow-[0_15px_30px_-10px_rgba(124,104,238,0.5)]" : "bg-white text-gray-800"
                  )}>
                    <div className="flex items-center gap-4 w-[40%]">
                      <div className={cn("h-[42px] w-[42px] rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-[10px] text-white shadow-sm", color.bg)}>
                        {color.text}
                      </div>
                      <span className="font-semibold text-[14px] truncate" title={task.title}>
                        {task.title}
                      </span>
                    </div>
                    <div className={cn("w-[20%] text-xs truncate", isActive ? "text-white/80" : "text-gray-400")}>
                      {task.project?.name || 'No Project'}
                    </div>
                    <div className={cn("w-[20%] text-xs", isActive ? "text-white/80" : "text-gray-400")}>
                      {formatDate(task.createdAt)}
                    </div>
                    <div className={cn("w-[10%] text-xs text-right pr-4", isActive ? "text-white/80" : "text-gray-400")}>
                      {task.status}
                    </div>
                    <div className={cn("flex items-center justify-end gap-3 w-[10%]", isActive ? "text-white" : "text-gray-400")}>
                      <Plus className="h-4 w-4" />
                      <Share2 className="h-4 w-4" />
                      <MoreVertical className="h-4 w-4" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Right Column / Widgets */}
      <div className="w-full xl:w-[320px] flex-shrink-0 space-y-6 pt-4 overflow-y-auto stylish-scrollbar pr-2 h-full pb-10">
        
        {/* Calendar Widget */}
        <div className="bg-white rounded-[24px] border border-[#F0F2F5] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-gray-900 text-[17px]">Calendar</h3>
            <ChevronUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex justify-between bg-[#F4F6F9] rounded-[10px] p-[3px] mb-6">
            <button className="flex-1 py-1.5 text-[12px] font-medium text-gray-500 rounded-[8px] transition-all">Week</button>
            <button className="flex-1 py-1.5 text-[12px] font-medium bg-[#7C68EE] text-white shadow-sm rounded-[8px] transition-all">Month</button>
            <button className="flex-1 py-1.5 text-[12px] font-medium text-gray-500 rounded-[8px] transition-all">Year</button>
          </div>
          
          <div className="flex justify-between items-center mb-5">
            <ChevronLeft className="h-4 w-4 text-gray-400 cursor-pointer" />
            <span className="text-[13px] font-bold text-gray-900">December 2019</span>
            <ChevronRight className="h-4 w-4 text-gray-400 cursor-pointer" />
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center mb-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <span key={d} className="text-[10px] font-semibold text-gray-400">{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-3 text-center text-[11px] font-semibold text-gray-600">
            {/* Fake calendar grid */}
            {[27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((num, i) => (
              <div 
                key={i} 
                className="relative h-6 w-6 mx-auto flex items-center justify-center cursor-pointer"
              >
                {num === 7 && i > 5 ? (
                  <div className="absolute inset-0 bg-[#7C68EE] text-white rounded-full flex items-center justify-center shadow-md">
                    {num}
                  </div>
                ) : (
                  <span className={cn(
                    "hover:text-gray-900 transition-colors", 
                    (i < 4) && "text-gray-300",
                    (num === 24 || num === 10) && "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-[#FF6B6B] after:rounded-full"
                  )}>
                    {num}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Your Task Widget */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-gray-900 text-[17px]">Your Upcoming Task</h3>
            <button className="text-gray-400 hover:text-gray-900 text-[11px] font-medium flex items-center">
              View All <ChevronRight className="h-3 w-3 ml-1" />
            </button>
          </div>
          
          {!yourUpcomingTask ? (
            <div className="bg-white rounded-[16px] border border-[#F0F2F5] p-4 text-center text-xs text-gray-400">
              No upcoming tasks!
            </div>
          ) : (
            <div className="bg-white rounded-[16px] border border-[#F0F2F5] p-4 shadow-sm flex items-start gap-4">
              <div className="w-1 h-12 bg-[#FF6B6B] rounded-full"></div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-[13px] font-bold text-gray-900">{yourUpcomingTask.title}</h4>
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-[11px] text-gray-400 mt-1 mb-3">
                  {yourUpcomingTask.dueDate ? `${formatDate(yourUpcomingTask.dueDate)} | ${formatTime(yourUpcomingTask.dueDate)}` : 'No due date'}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                    {yourUpcomingTask.project?.name || 'Standalone Task'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Storage Widget */}
        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-gray-900 text-[17px]">Storage</h3>
            <button className="text-gray-400 hover:text-gray-900 text-[11px] font-medium flex items-center">
              View All <ChevronRight className="h-3 w-3 ml-1" />
            </button>
          </div>
          <div className="bg-white rounded-[24px] border border-[#F0F2F5] p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[13px] font-medium text-gray-600">Available Space <span className="text-[#7C68EE] font-bold ml-1">{storageInfo?.available || '0 GB'}</span></span>
              <div className="flex items-center gap-1 bg-[#F4F6F9] px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-gray-600 cursor-pointer">
                <Calendar className="h-3 w-3" /> Month <ChevronDown className="h-3 w-3 ml-1" />
              </div>
            </div>
            
            <div className="h-32 flex items-end justify-between px-1 relative">
              {/* Y Axis labels */}
              <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[9px] text-gray-400 font-medium">
                <span>50</span>
                <span>40</span>
                <span>30</span>
                <span>20</span>
                <span>10</span>
              </div>
              
              <div className="flex items-end justify-between w-full pl-6">
                {/* Fake bar chart columns */}
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((month, i) => {
                  const h1 = 20 + Math.random() * 20; // Blue
                  const h2 = 5 + Math.random() * 15; // Yellow
                  const h3 = 10 + Math.random() * 25; // Red
                  
                  return (
                    <div key={month} className="flex flex-col items-center gap-3 w-full relative">
                      <div className="w-[3px] flex flex-col justify-end overflow-hidden h-28 gap-1">
                        <div className="bg-[#FF6B6B] w-full rounded-full" style={{ height: `${h3}%` }}></div>
                        <div className="bg-[#FFB84C] w-full rounded-full" style={{ height: `${h2}%` }}></div>
                        <div className="bg-[#7C68EE] w-full rounded-full" style={{ height: `${h1}%` }}></div>
                      </div>
                      <span className="text-[9px] text-gray-400 font-medium">{month}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            
            <div className="flex justify-between mt-5 px-1">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-medium">
                <div className="h-2.5 w-2.5 rounded-full bg-white border-2 border-[#FF6B6B]"></div> Uploads
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-medium">
                <div className="h-2.5 w-2.5 rounded-full bg-white border-2 border-[#FFB84C]"></div> Files Received
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-medium">
                <div className="h-2.5 w-2.5 rounded-full bg-white border-2 border-[#7C68EE]"></div> Space Left
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
