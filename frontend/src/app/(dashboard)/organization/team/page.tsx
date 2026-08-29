"use client";

import * as React from "react";
import { useAuthStore } from "../../../../store/auth.store";
import { Button } from "../../../../components/ui/button";
import { Plus, Search, MoreVertical, Loader2 } from "lucide-react";
import { organizationsApi, OrganizationMember } from "../../../../lib/api/organizations.api";
import { InviteMemberModal } from "../../../../components/organizations/invite-member-modal";

export default function OrganizationTeamPage() {
  const { user } = useAuthStore();
  const [members, setMembers] = React.useState<OrganizationMember[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await organizationsApi.getMembers();
      setMembers(data);
    } catch (error) {
      console.error("Failed to fetch members", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = members.filter(
    m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'Organization Admin': return 'bg-[#FF6B6B]';
      case 'Project Manager': return 'bg-[#FFB84C]';
      case 'Team Lead': return 'bg-[#34D399]';
      case 'Developer': return 'bg-[#7C68EE]';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="flex flex-col h-full px-10 pb-10 gap-10 bg-white">
      <div className="flex-1 space-y-10 overflow-y-auto pr-2 stylish-scrollbar">
        
        {/* Header */}
        <div className="flex justify-between items-center mt-2">
          <h1 className="text-[22px] font-bold text-gray-900">Team Members</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 bg-[#F4F6F9] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#7C68EE] outline-none transition-all w-64"
              />
            </div>
            <Button 
              onClick={() => setIsInviteModalOpen(true)}
              className="bg-[#7C68EE] hover:bg-[#6b58dd] text-white rounded-[14px] px-5 py-5 h-auto shadow-sm font-medium"
            >
              <Plus className="h-4 w-4 mr-2" /> Invite Member
            </Button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#7C68EE]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMembers.map(member => (
              <div key={member.id} className="bg-white rounded-[24px] border border-[#F0F2F5] p-6 shadow-sm hover:shadow-md transition-shadow relative">
                <div className="absolute top-6 right-6">
                  <MoreVertical className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-900" />
                </div>
                
                <div className="flex flex-col items-center text-center mt-2">
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 shadow-sm ${getRoleColor(member.role)}`}>
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-[17px] font-bold text-gray-900">{member.name}</h3>
                  <p className="text-[13px] text-gray-500 mb-4">{member.email}</p>
                  
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F6F9]">
                    <div className={`h-2 w-2 rounded-full ${getRoleColor(member.role)}`}></div>
                    <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">{member.role}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredMembers.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                No members found matching your search.
              </div>
            )}
          </div>
        )}
      </div>

      <InviteMemberModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        onSuccess={fetchMembers} 
      />
    </div>
  );
}
