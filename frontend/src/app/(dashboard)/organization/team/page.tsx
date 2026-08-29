"use client";

import * as React from "react";
import { useAuthStore } from "../../../../store/auth.store";
import { Button } from "../../../../components/ui/button";
import { Plus, Search, MoreHorizontal, Loader2, Users, Mailbox, CheckCircle2, XCircle, Clock, RefreshCw } from "lucide-react";
import { organizationsService, OrganizationMember, OrganizationInvitation } from "../../../../services/organization/organizations.service";
import { InviteMemberModal } from "../../../../components/organizations/invite-member-modal";

export default function OrganizationTeamPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = React.useState<"members" | "invitations">("members");
  
  const [members, setMembers] = React.useState<OrganizationMember[]>([]);
  const [invitations, setInvitations] = React.useState<OrganizationInvitation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [membersData, invitationsData] = await Promise.all([
        organizationsService.getMembers(),
        organizationsService.getInvitations()
      ]);
      setMembers(membersData);
      setInvitations(invitationsData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const filteredMembers = members.filter(
    m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInvitations = invitations.filter(
    i => 
      i.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
      i.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'Organization Admin': return 'bg-red-50 text-red-600 border-red-200';
      case 'Project Manager': return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'Team Lead': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'Developer': return 'bg-indigo-50 text-indigo-600 border-indigo-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status.toUpperCase()) {
      case 'ACTIVE':
      case 'ACCEPTED': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-bold text-emerald-600 tracking-wide"><CheckCircle2 className="h-3.5 w-3.5" /> {status}</span>;
      case 'PENDING': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-[11px] font-bold text-amber-600 tracking-wide"><Clock className="h-3.5 w-3.5" /> PENDING</span>;
      case 'DECLINED':
      case 'INACTIVE': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-100 text-[11px] font-bold text-red-600 tracking-wide"><XCircle className="h-3.5 w-3.5" /> {status}</span>;
      default: return <span className="px-2.5 py-1 rounded-full bg-gray-100 text-[11px] font-bold text-gray-600">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col h-full px-10 pb-10 gap-8 bg-white overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center mt-2 flex-shrink-0">
        <div>
          <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">Team & Members</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your organization's members and pending invitations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            onClick={fetchData}
            disabled={loading}
            className="rounded-[14px] px-4 py-5 h-auto shadow-sm font-medium border-gray-200"
            title="Refresh Data"
          >
            <RefreshCw className={`h-5 w-5 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            onClick={() => setIsInviteModalOpen(true)}
            className="bg-[#7C68EE] hover:bg-[#6b58dd] text-white rounded-[14px] px-6 py-5 h-auto shadow-sm font-medium"
          >
            <Plus className="h-5 w-5 mr-2" /> Invite Member
          </Button>
        </div>
      </div>

      {/* Tabs and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0 bg-[#F8FAFC] p-2 rounded-2xl border border-gray-100">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab("members")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "members" ? "bg-white text-gray-900 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700 hover:bg-white/50"}`}
          >
            <Users className="h-4 w-4" /> Members ({members.length})
          </button>
          <button 
            onClick={() => setActiveTab("invitations")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "invitations" ? "bg-white text-gray-900 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700 hover:bg-white/50"}`}
          >
            <Mailbox className="h-4 w-4" /> Invitations ({invitations.length})
          </button>
        </div>

        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ colorScheme: 'light' }}
            className="w-full sm:w-72 pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#7C68EE] focus:border-[#7C68EE] outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
        {loading ? (
          <div className="flex-1 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#7C68EE]" />
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-auto stylish-scrollbar flex-1 relative">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-[#F8FAFC] sticky top-0 z-10 border-b border-gray-200">
                <tr>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  {activeTab === "invitations" && (
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Sent Date</th>
                  )}
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Members Tab */}
                {activeTab === "members" && filteredMembers.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{member.name}</div>
                          <div className="text-gray-500 text-xs">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-bold ${getRoleBadge(member.role)}`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(member.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Invitations Tab */}
                {activeTab === "invitations" && filteredInvitations.map(invite => (
                  <tr key={invite.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm shadow-sm flex-shrink-0">
                          @
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{invite.email}</div>
                          <div className="text-gray-400 text-xs italic">Awaiting registration...</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-bold ${getRoleBadge(invite.role)}`}>
                        {invite.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(invite.status)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600 font-medium">{formatDate(invite.createdAt)}</div>
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
            {activeTab === "members" && filteredMembers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center h-full absolute inset-0">
                <Users className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No members found</h3>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search query.</p>
              </div>
            )}

            {activeTab === "invitations" && filteredInvitations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center h-full absolute inset-0">
                <Mailbox className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No invitations found</h3>
                <p className="text-sm text-gray-500 mt-1">You haven't sent any invitations yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <InviteMemberModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        onSuccess={fetchData} 
      />
    </div>
  );
}
