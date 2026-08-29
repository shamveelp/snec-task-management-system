"use client"

import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw, Bell, MessageSquare, Paperclip, FolderKanban, CheckSquare, UserPlus, Clock } from 'lucide-react';
import { organizationsService } from '../../../../services/organization/organizations.service';
import { formatDistanceToNow } from 'date-fns';

export default function OrganizationNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchNotifications = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    try {
      const data = await organizationsService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    // Set up polling every 5 seconds
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'PROJECT_CREATED':
        return <FolderKanban className="h-5 w-5 text-indigo-500" />;
      case 'TASK_CREATED':
        return <CheckSquare className="h-5 w-5 text-emerald-500" />;
      case 'COMMENT_ADDED':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'ATTACHMENT_UPLOADED':
        return <Paperclip className="h-5 w-5 text-amber-500" />;
      case 'MEMBER_JOINED':
        return <UserPlus className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1F37] mb-1">Organization Updates</h1>
          <p className="text-[#8F96AE] text-sm">Real-time notifications for activities across your organization.</p>
        </div>
        <button
          onClick={() => fetchNotifications(true)}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E9ECF5] rounded-xl shadow-sm text-[#1C1F37] font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Reload'}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 text-[#7C68EE] animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-[24px] p-12 text-center border border-[#E9ECF5] shadow-sm">
          <div className="h-16 w-16 bg-[#E9ECF5] rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="h-8 w-8 text-[#8F96AE]" />
          </div>
          <h3 className="text-lg font-bold text-[#1C1F37] mb-2">No Updates Yet</h3>
          <p className="text-[#8F96AE] text-sm max-w-md mx-auto">
            When team members create projects, add tasks, or comment, those activities will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[24px] border border-[#E9ECF5] shadow-sm overflow-hidden">
          <div className="divide-y divide-[#E9ECF5]">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-5 hover:bg-gray-50 transition-colors flex gap-4 items-start">
                <div className="mt-1 h-10 w-10 rounded-full bg-[#E9ECF5] flex items-center justify-center flex-shrink-0">
                  {getIconForType(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <p className="text-[15px] font-bold text-[#1C1F37]">
                      {notification.title}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#8F96AE] whitespace-nowrap">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                  
                  {notification.description && (
                    <p className="text-sm text-[#5C6584] mb-3 bg-[#F8F9FC] p-3 rounded-lg border border-[#E9ECF5]">
                      {notification.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-[#7C68EE] to-[#FFB84C] flex items-center justify-center text-[10px] font-bold text-white shadow-sm flex-shrink-0 overflow-hidden">
                        {notification.user?.profilePicture ? (
                          <img src={notification.user.profilePicture} alt={notification.user.name} className="h-full w-full object-cover" />
                        ) : (
                          notification.user?.name?.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                      <span className="text-xs font-medium text-[#5C6584]">
                        {notification.user?.name || 'Unknown User'}
                      </span>
                    </div>
                    
                    {notification.metadata?.projectName && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#7C68EE]/10 text-[#7C68EE] text-[11px] font-bold">
                        <FolderKanban className="h-3 w-3" />
                        {notification.metadata.projectName}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
