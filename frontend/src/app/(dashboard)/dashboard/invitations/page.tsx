"use client";

import * as React from "react";
import { useAuthStore } from "../../../../store/auth.store";
import { Button } from "../../../../components/ui/button";
import { invitationsService, PendingInvitation } from "../../../../services/user/invitations.service";
import { Loader2, Mail, Building, Clock, Check, X, ArrowRight, RefreshCw } from "lucide-react";
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
      const data = await invitationsService.getMyInvitations();
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
      await invitationsService.acceptInvitation(token);
      setInvitations(prev => prev.filter(inv => inv.id !== id));
      router.push('/dashboard');
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
    <div className="flex-1 overflow-y-auto stylish-scrollbar-dark px-8 pb-8 pt-[104px] h-full bg-[#131417]">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white/90">Invitations</h1>
          <p className="text-white/40 mt-1">Manage your pending invitations to join organizations.</p>
        </div>
        <button onClick={fetchInvitations} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50 border border-white/[0.04]">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost"
            onClick={fetchInvitations}
            disabled={loading}
            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 h-10"
            title="Refresh Data"
          >
            <RefreshCw className={`h-4 w-4 text-white/70 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <div className="bg-[#18191E] border border-white/[0.04] px-4 py-2 rounded-xl text-sm font-medium text-white/70 flex items-center gap-2">
            <Mail className="h-4 w-4 text-white/40" />
            {invitations.length} Pending
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6]" />
        </div>
      ) : (
        <div className="max-w-4xl">
          {invitations.length === 0 ? (
            <div className="bg-[#1C1E24] border border-white/[0.04] rounded-2xl p-16 flex flex-col items-center justify-center text-center">
              <div className="h-24 w-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Mail className="h-10 w-10 text-white/20" />
              </div>
              <h3 className="text-xl font-bold text-white/90 mb-2">No pending invitations</h3>
              <p className="text-white/40 max-w-md">You don't have any pending invitations right now. When an organization invites you, it will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {invitations.map((invite, index) => {
                const colors = [
                  "from-[#3B82F6] to-[#2563EB]",
                  "from-[#22C55E] to-[#16A34A]",
                  "from-[#F97316] to-[#EA580C]",
                  "from-[#8B5CF6] to-[#7C3AED]"
                ];
                const colorClass = colors[index % colors.length];

                return (
                  <div key={invite.id} className="group bg-[#1C1E24] border border-white/[0.04] hover:border-white/10 rounded-2xl p-6 transition-colors relative overflow-hidden flex flex-col">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClass} opacity-5 rounded-full blur-2xl -mr-10 -mt-10 transition-opacity group-hover:opacity-10`}></div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${colorClass} p-[1px]`}>
                            <div className="h-full w-full bg-[#1C1E24] rounded-xl flex items-center justify-center">
                              <span className="text-xl font-bold text-white">{invite.organizationName.charAt(0)}</span>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{invite.organizationName}</h3>
                            <p className="text-[11px] font-medium text-white/40 uppercase tracking-wider">{invite.organizationCategory || 'Organization'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/5 border border-white/5 rounded-xl p-4 mb-6 relative">
                        <p className="text-sm text-white/70">
                          You have been invited to join as a <strong className="text-white/90 font-bold">{invite.roleName}</strong>.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.04]">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-white/40">
                        <Clock className="h-3.5 w-3.5" />
                        {getDaysLeft(invite.expiresAt)}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost"
                          className="bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-lg px-4 h-9 shadow-sm font-medium text-sm border border-transparent"
                        >
                          Decline
                        </Button>
                        <Button 
                          onClick={() => handleAccept(invite.token, invite.id)}
                          disabled={processingId === invite.id}
                          className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg px-6 h-9 shadow-sm font-medium text-sm transition-colors"
                        >
                          {processingId === invite.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Check className="h-4 w-4 mr-2" />
                          )}
                          Accept Invite
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
