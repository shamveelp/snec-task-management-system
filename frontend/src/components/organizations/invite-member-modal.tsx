import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Loader2, X, Search, Mail, Users } from 'lucide-react';
import axios from 'axios';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function InviteMemberModal({ isOpen, onClose, onSuccess }: InviteMemberModalProps) {
  const [email, setEmail] = React.useState('');
  const [roleId, setRoleId] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Auto-fetch "Member" role ID
  React.useEffect(() => {
    if (isOpen) {
      setEmail('');
      setError('');
      setSuccess('');
      setSearchResults([]);
      setShowDropdown(false);

      // Fetch Member role ID
      axios.get('http://localhost:5000/organizations/roles').then((res) => {
        const memberRole = res.data[0]; // Only Member role is returned now
        if (memberRole) setRoleId(memberRole.id);
      }).catch(console.error);
    }
  }, [isOpen]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (value.length >= 2) {
      setShowDropdown(true);
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const token = localStorage.getItem('accessToken');
          const res = await axios.get(
            `http://localhost:5000/organizations/search-developers?q=${encodeURIComponent(value)}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setSearchResults(res.data);
        } catch { /* ignore */ } finally {
          setIsSearching(false);
        }
      }, 500);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
      setIsSearching(false);
    }
  };

  const selectUser = (u: any) => {
    setEmail(u.email);
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleId) { setError('Could not load role. Please try again.'); return; }
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(
        'http://localhost:5000/invitations',
        { email: email.trim(), roleId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Invitation sent successfully!');
      setTimeout(onSuccess, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-visible relative"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 bg-[#F8FAFC] rounded-t-3xl flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Users className="h-4 w-4 text-[#7C68EE]" />
                <h2 className="text-xl font-bold text-gray-900">Invite Member</h2>
              </div>
              <p className="text-sm text-gray-400 mt-0.5">They'll join as a <strong>Member</strong> of your organization.</p>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-8 bg-white rounded-b-3xl overflow-visible">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">{error}</div>
              )}
              {success && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">{success}</div>
              )}

              {/* Email Search */}
              <div className="space-y-1.5 relative">
                <label className="block text-sm font-semibold text-gray-700">
                  <Mail className="inline h-4 w-4 mr-1.5 text-gray-400" />
                  Email Address or Name
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search or enter email..."
                    value={email}
                    onChange={handleEmailChange}
                    style={{ colorScheme: 'light' }}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#7C68EE] focus:ring-2 focus:ring-[#7C68EE]/20 outline-none transition-all"
                    required
                    autoComplete="off"
                  />
                  {isSearching && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>

                {showDropdown && (
                  <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                    {searchResults.length > 0 ? (
                      <ul className="max-h-48 overflow-auto py-1">
                        {searchResults.map((u) => (
                          <li
                            key={u.id}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors"
                            onClick={() => selectUser(u)}
                          >
                            <div className="h-8 w-8 rounded-full bg-[#7C68EE]/10 flex items-center justify-center text-[#7C68EE] font-bold text-sm flex-shrink-0">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{u.name}</div>
                              <div className="text-xs text-gray-400">{u.email}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : !isSearching ? (
                      <div className="px-4 py-4 text-sm text-gray-400">
                        No registered users found. An invite email will be sent.
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Role info (read-only) */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#7C68EE]/5 border border-[#7C68EE]/20">
                <div className="h-8 w-8 rounded-full bg-[#7C68EE]/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-4 w-4 text-[#7C68EE]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Member</p>
                  <p className="text-xs text-gray-400">Roles are assigned per-project by project managers.</p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#7C68EE] hover:bg-[#6b58dd] text-white rounded-xl py-3 h-auto font-semibold shadow-sm transition-all"
                disabled={loading}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {loading ? 'Sending...' : 'Send Invitation'}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
