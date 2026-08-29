"use client";

import * as React from "react";
import { useAuthStore } from "../../../../store/auth.store";
import { Button } from "../../../../components/ui/button";
import { InviteMemberModal } from "../../../../components/organizations/invite-member-modal";
import axios from "axios";
import { Loader2, Plus, Users, UserPlus, FolderKanban, Activity, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../../../lib/utils";

export default function OrganizationDashboardPage() {
  const { user } = useAuthStore();
  const [members, setMembers] = React.useState<any[]>([]);
  const [invitations, setInvitations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const headers = { Authorization: `Bearer ${token}` };
      const [membersRes, invitesRes] = await Promise.all([
        axios.get('http://localhost:5000/organizations/members', { headers }),
        axios.get('http://localhost:5000/organizations/invitations', { headers })
      ]);
      setMembers(membersRes.data);
      setInvitations(invitesRes.data);
    } catch (err) {
      console.error("Failed to fetch team data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  const activeMembersCount = members.filter(m => m.status === 'ACTIVE').length;
  const pendingInvitesCount = invitations.filter(i => i.status === 'PENDING').length;

  const stats = [
    { title: "Total Members", value: members.length, icon: Users, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { title: "Active Members", value: activeMembersCount, icon: Activity, color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30" },
    { title: "Pending Invites", value: pendingInvitesCount, icon: UserPlus, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30" },
    { title: "Total Projects", value: "0", icon: FolderKanban, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[500px]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your team and monitor organization activity.</p>
        </div>
        <Button onClick={() => setIsInviteModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200">
          <Plus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.title}
            className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center space-x-4 hover:shadow-md transition-shadow"
          >
            <div className={cn("p-3 rounded-lg flex-shrink-0", stat.bg, stat.color)}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="team">
        
        {/* Active Members Table */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col h-[500px]"
        >
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Active Members</h2>
            <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 py-1 px-3 rounded-full text-xs font-semibold">
              {members.length} Total
            </span>
          </div>
          
          <div className="flex-1 overflow-auto">
            {members.length > 0 ? (
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {members.map(member => (
                  <li key={member.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {member.email}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-300">
                          {member.role}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
                <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                <p>No active members yet.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Pending Invitations Table */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col h-[500px]"
        >
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Pending Invitations</h2>
            <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 py-1 px-3 rounded-full text-xs font-semibold">
              {pendingInvitesCount} Pending
            </span>
          </div>
          
          <div className="flex-1 overflow-auto">
            {invitations.length > 0 ? (
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {invitations.map(invite => (
                  <li key={invite.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{invite.email}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Role: {invite.role}</p>
                        </div>
                      </div>
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        invite.status === 'PENDING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                        invite.status === 'ACCEPTED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      )}>
                        {invite.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
                <Mail className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                <p>No pending invitations.</p>
              </div>
            )}
          </div>
        </motion.div>

      </div>

      <InviteMemberModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        onSuccess={() => {
          setIsInviteModalOpen(false);
          fetchData();
        }}
      />
    </div>
  );
}
