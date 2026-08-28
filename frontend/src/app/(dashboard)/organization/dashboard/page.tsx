"use client";

import * as React from "react";
import { useAuthStore } from "../../../../store/auth.store";
import { ProtectedRoute } from "../../../../components/auth/protected-route";
import { Button } from "../../../../components/ui/button";
import { InviteMemberModal } from "../../../../components/organizations/invite-member-modal";
import axios from "axios";
import { Loader2, Plus } from "lucide-react";

export default function OrganizationDashboardPage() {
  const { user, logout } = useAuthStore();
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

  return (
    <ProtectedRoute allowedRoles={["Organization Admin"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Organization Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-300">
                Welcome, {user?.name || user?.username}
              </span>
              <Button onClick={() => logout()} variant="outline">
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Team Management</h2>
            <Button onClick={() => setIsInviteModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <h3 className="font-medium text-lg">Active Members ({members.length})</h3>
                </div>
                <ul className="divide-y">
                  {members.map(member => (
                    <li key={member.id} className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          {member.role}
                        </span>
                      </div>
                    </li>
                  ))}
                  {members.length === 0 && (
                    <li className="p-6 text-center text-muted-foreground">No active members found.</li>
                  )}
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <h3 className="font-medium text-lg">Pending Invitations ({invitations.filter(i => i.status === 'PENDING').length})</h3>
                </div>
                <ul className="divide-y">
                  {invitations.map(invite => (
                    <li key={invite.id} className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{invite.email}</p>
                          <p className="text-sm text-muted-foreground">Invited as: {invite.role}</p>
                        </div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          invite.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          invite.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {invite.status}
                        </span>
                      </div>
                    </li>
                  ))}
                  {invitations.length === 0 && (
                    <li className="p-6 text-center text-muted-foreground">No pending invitations.</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>

      <InviteMemberModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        onSuccess={() => {
          setIsInviteModalOpen(false);
          fetchData();
        }}
      />
    </ProtectedRoute>
  );
}
