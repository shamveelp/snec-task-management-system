"use client";

import * as React from "react";
import { useAuthStore } from "../../../../store/auth.store";
import { Button } from "../../../../components/ui/button";
import { invitationsApi, PendingInvitation } from "../../../../lib/api/invitations.api";
import { Loader2, Mail, Building, Clock, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserInvitationsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [invitations, setInvitations] = React.useState<PendingInvitation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [processingId, setProcessingId] = React.useState<string | null>(null);

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const data = await invitationsApi.getMyInvitations();
      setInvitations(data);
    } catch (error) {
      console.error("Failed to fetch invitations", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchInvitations();
  }, []);

  const handleAccept = async (token: string, id: string) => {
    setProcessingId(id);
    try {
      await invitationsApi.acceptInvitation(token);
      // Remove accepted invitation from list
      setInvitations(prev => prev.filter(inv => inv.id !== id));
      // Option: redirect to organizations dashboard
      router.push('/dashboard/organizations');
    } catch (error) {
      console.error("Failed to accept invitation", error);
      alert("Failed to accept invitation. It may have expired.");
    } finally {
      setProcessingId(null);
    }
  };

  const getDaysLeft = (expiresAt: string) => {
    const days = Math.ceil((new Date(expiresAt).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    return days > 0 ? `${days} days left` : 'Expired';
  };

  return (
    <div className="flex flex-col h-full px-10 pb-10 gap-10 bg-white">
      <div className="flex-1 space-y-10 overflow-y-auto pr-2 stylish-scrollbar">
        
        {/* Header */}
        <div className="flex justify-between items-center mt-2">
          <h1 className="text-[22px] font-bold text-gray-900">Your Invitations</h1>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#7C68EE]" />
          </div>
        ) : (
          <div className="space-y-4">
            {invitations.length === 0 ? (
              <div className="bg-[#F4F6F9] rounded-[24px] p-12 flex flex-col items-center justify-center text-center">
                <Mail className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No pending invitations</h3>
                <p className="text-gray-500">You don't have any pending invitations to join organizations.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {invitations.map(invite => (
                  <div key={invite.id} className="bg-white rounded-[24px] border border-[#F0F2F5] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#7C68EE] to-[#4c3ab8] flex items-center justify-center text-white shadow-sm">
                            <Building className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{invite.organizationName}</h3>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{invite.organizationCategory}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-[#F4F6F9] rounded-xl p-4 mb-6">
                        <p className="text-sm text-gray-600">
                          You have been invited to join as a <strong className="text-gray-900">{invite.roleName}</strong>.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-orange-500 bg-orange-50 px-3 py-1.5 rounded-full">
                        <Clock className="h-3.5 w-3.5" />
                        {getDaysLeft(invite.expiresAt)}
                      </div>
                      <Button 
                        onClick={() => handleAccept(invite.token, invite.id)}
                        disabled={processingId === invite.id}
                        className="bg-[#34D399] hover:bg-[#2fb885] text-white rounded-[12px] px-6 shadow-sm font-medium"
                      >
                        {processingId === invite.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                        )}
                        Accept Invite
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
