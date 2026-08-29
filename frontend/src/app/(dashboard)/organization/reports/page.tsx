'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Loader2, RefreshCw, TrendingUp, CheckCircle2, Clock, Users, LayoutDashboard } from 'lucide-react';
import { reportsService, ProjectProgressData, UserProductivityData, TaskCompletionStatsData, OverdueTaskData } from '../../../../services/organization/reports.service';
import { format } from 'date-fns';

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [projectProgress, setProjectProgress] = useState<ProjectProgressData[]>([]);
  const [userProductivity, setUserProductivity] = useState<UserProductivityData[]>([]);
  const [taskStats, setTaskStats] = useState<TaskCompletionStatsData | null>(null);
  const [overdueTasks, setOverdueTasks] = useState<OverdueTaskData[]>([]);

  const fetchReports = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) setIsRefreshing(true);
      
      const [progress, productivity, stats, overdue] = await Promise.all([
        reportsService.getProjectProgress(),
        reportsService.getUserProductivity(),
        reportsService.getTaskCompletion(),
        reportsService.getOverdueTasks()
      ]);

      setProjectProgress(progress);
      setUserProductivity(productivity);
      setTaskStats(stats);
      setOverdueTasks(overdue);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center pt-28">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const completionRate = taskStats?.TOTAL ? Math.round((taskStats.DONE / taskStats.TOTAL) * 100) : 0;

  return (
    <div className="p-6 pt-28 max-w-7xl mx-auto space-y-8 text-black">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Organization Reports</h1>
          <p className="text-muted-foreground mt-2 text-black/70">
            Overview of project progress, user productivity, and task statistics.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => fetchReports(true)}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Task Completion Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Tasks</h3>
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">{taskStats?.TOTAL || 0}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Completed</h3>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">{taskStats?.DONE || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">{completionRate}% completion rate</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">In Progress</h3>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">{taskStats?.IN_PROGRESS || 0}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-red-700">Overdue Tasks</h3>
            <Clock className="h-4 w-4 text-red-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-red-700">{overdueTasks.length}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Progress */}
        <div className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              Project Progress
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Completion percentage of active projects.</p>
          </div>
          <div className="p-6 space-y-6">
            {projectProgress.length === 0 ? (
              <p className="text-muted-foreground text-sm">No projects found.</p>
            ) : (
              projectProgress.map(project => (
                <div key={project.projectId} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{project.projectName}</span>
                    <span className="text-muted-foreground">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{project.completedTasks} of {project.totalTasks} tasks done</span>
                    <Badge variant="outline" className="text-[10px] uppercase">{project.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User Productivity */}
        <div className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Users className="h-5 w-5 text-primary" />
              Top Contributors
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Team members ranked by completed tasks.</p>
          </div>
          <div className="p-6">
            {userProductivity.length === 0 ? (
              <p className="text-muted-foreground text-sm">No user activity found.</p>
            ) : (
              <div className="space-y-6">
                {userProductivity.slice(0, 5).map((prod, index) => (
                  <div key={prod.user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="font-bold text-muted-foreground w-4">{index + 1}.</div>
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs">
                        {prod.user.profilePicture ? (
                          <img src={prod.user.profilePicture} alt={prod.user.name} className="h-full w-full rounded-full object-cover" />
                        ) : (
                          prod.user.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">{prod.user.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{prod.user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{prod.tasksCompleted} <span className="text-muted-foreground font-normal">done</span></div>
                      <div className="text-xs text-muted-foreground">{prod.completionRate}% rate</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overdue Tasks List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-red-600">
            <Clock className="h-5 w-5" />
            Overdue Tasks Warning
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Tasks that have missed their due date and are not yet completed.</p>
        </div>
        <div className="p-0">
          {overdueTasks.length === 0 ? (
            <p className="text-muted-foreground text-sm">No overdue tasks right now. Great job!</p>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 rounded-tl-lg">Task</th>
                    <th className="px-6 py-3">Project</th>
                    <th className="px-6 py-3">Assignee</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 rounded-tr-lg">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueTasks.map((task) => (
                    <tr key={task.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="px-6 py-4 font-medium">{task.title}</td>
                      <td className="px-6 py-4 text-muted-foreground">{task.project.name}</td>
                      <td className="px-6 py-4">
                        {task.assignee ? (
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-[10px]">
                              {task.assignee.profilePicture ? (
                                <img src={task.assignee.profilePicture} alt={task.assignee.name} className="h-full w-full rounded-full object-cover" />
                              ) : (
                                task.assignee.name.charAt(0)
                              )}
                            </div>
                            <span>{task.assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{task.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-red-600 font-medium whitespace-nowrap">
                        {format(new Date(task.dueDate), 'MMM d, yyyy')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
