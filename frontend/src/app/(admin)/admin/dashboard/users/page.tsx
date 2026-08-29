"use client";

import React, { useEffect, useState, useRef } from 'react';
import { adminService, AdminUserData } from '../../../../../services/admin/admin.service';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Search, Plus, Edit2, Trash2, Shield, Power, CheckCircle2, XCircle, X, AlertTriangle } from 'lucide-react';
import { AppSelect, AppInput } from '../../../../../components/ui/form-fields';
import { PasswordInput } from '../../../../../components/ui/password-input';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState<AdminUserData | null>(null);

  // Form States
  const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '', roleId: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Live Validation States
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const usernameTimer = useRef<NodeJS.Timeout | null>(null);
  const emailTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers({ query, page, limit: 10 });
      setUsers(res.data);
      setTotalPages(res.meta.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  // Search Debounce
  const searchTimer = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPage(1);
      fetchUsers();
    }, 500);
    return () => clearTimeout(searchTimer.current!);
  }, [query]);

  // --- Live Check Logic ---

  const checkUsername = async (val: string) => {
    if (!val) { setUsernameStatus('idle'); return; }
    if (isEditModalOpen && selectedUser?.username === val) { setUsernameStatus('available'); return; }
    
    setUsernameStatus('checking');
    try {
      const res = await adminService.checkUsername(val);
      setUsernameStatus(res.available ? 'available' : 'taken');
    } catch {
      setUsernameStatus('idle');
    }
  };

  const checkEmail = async (val: string) => {
    if (!val || !/^\S+@\S+\.\S+$/.test(val)) { setEmailStatus('idle'); return; }
    if (isEditModalOpen && selectedUser?.email === val) { setEmailStatus('available'); return; }
    
    setEmailStatus('checking');
    try {
      const res = await adminService.checkEmail(val);
      setEmailStatus(res.available ? 'available' : 'taken');
    } catch {
      setEmailStatus('idle');
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, username: val }));
    if (usernameTimer.current) clearTimeout(usernameTimer.current);
    usernameTimer.current = setTimeout(() => checkUsername(val), 500);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, email: val }));
    if (emailTimer.current) clearTimeout(emailTimer.current);
    emailTimer.current = setTimeout(() => checkEmail(val), 500);
  };

  // --- Modals Logic ---

  const openCreateModal = () => {
    setFormData({ name: '', username: '', email: '', password: '', roleId: '' });
    setUsernameStatus('idle');
    setEmailStatus('idle');
    setFormErrors({});
    setIsCreateModalOpen(true);
  };

  const openEditModal = (user: AdminUserData) => {
    setSelectedUser(user);
    setFormData({ 
      name: user.name, 
      username: user.username || '', 
      email: user.email, 
      password: '', 
      roleId: user.role?.id || '' 
    });
    setUsernameStatus('available');
    setEmailStatus('available');
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameStatus === 'taken' || emailStatus === 'taken') return;
    try {
      await adminService.createUser(formData);
      setIsCreateModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      setFormErrors({ submit: err.response?.data?.message || 'Failed to create user' });
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    if (usernameStatus === 'taken' || emailStatus === 'taken') return;
    try {
      await adminService.updateUser(selectedUser.id, formData);
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      setFormErrors({ submit: err.response?.data?.message || 'Failed to update user' });
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedUser) return;
    try {
      const newStatus = selectedUser.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await adminService.updateUserStatus(selectedUser.id, newStatus);
      setIsDeactivateModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await adminService.deleteUser(selectedUser.id);
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage system users, roles, and access</p>
        </div>
        <Button onClick={openCreateModal} className="bg-[#7C68EE] hover:bg-[#6b58d9] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by precise name, email, or username..." 
            className="pl-9 bg-gray-50/50 border-gray-200"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading users...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No users found.</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt="" className="h-9 w-9 rounded-full object-cover bg-gray-100 border border-gray-200" />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#7C68EE] to-[#4c3ab8] flex items-center justify-center text-white text-sm font-bold shadow-sm">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">@{user.username || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#7C68EE]/10 text-[#7C68EE] text-xs font-medium">
                      <Shield className="h-3 w-3" />
                      {user.role?.name || 'User'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${user.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                      {user.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setSelectedUser(user); setIsDeactivateModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-[#7C68EE] hover:bg-[#7C68EE]/10 rounded-lg transition-colors" title={user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}>
                        <Power className="h-4 w-4" />
                      </button>
                      <button onClick={() => openEditModal(user)} className="p-1.5 text-gray-400 hover:text-[#7C68EE] hover:bg-[#7C68EE]/10 rounded-lg transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <span className="text-sm text-gray-500">Page {page} of {totalPages || 1}</span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* --- CREATE / EDIT MODAL --- */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">{isCreateModalOpen ? 'Create New User' : 'Edit User'}</h2>
              <button onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={isCreateModalOpen ? handleCreateUser : handleEditUser} className="p-6 space-y-4">
              {formErrors.submit && (
                <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-lg border border-rose-100 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {formErrors.submit}
                </div>
              )}
              
              <AppInput
                label="Full Name"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
              />

              <div className="relative">
                <AppInput
                  label="Username"
                  required
                  value={formData.username}
                  onChange={handleUsernameChange}
                  placeholder="johndoe"
                />
                {usernameStatus === 'checking' && <div className="absolute right-3 top-9 text-xs text-gray-400">Checking...</div>}
                {usernameStatus === 'available' && <CheckCircle2 className="absolute right-3 top-[34px] h-5 w-5 text-emerald-500" />}
                {usernameStatus === 'taken' && <XCircle className="absolute right-3 top-[34px] h-5 w-5 text-rose-500" />}
                {usernameStatus === 'taken' && <span className="text-xs text-rose-500 mt-1 block">Username is taken</span>}
              </div>

              <div className="relative">
                <AppInput
                  label="Email Address"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleEmailChange}
                  placeholder="john@example.com"
                />
                {emailStatus === 'checking' && <div className="absolute right-3 top-9 text-xs text-gray-400">Checking...</div>}
                {emailStatus === 'available' && <CheckCircle2 className="absolute right-3 top-[34px] h-5 w-5 text-emerald-500" />}
                {emailStatus === 'taken' && <XCircle className="absolute right-3 top-[34px] h-5 w-5 text-rose-500" />}
                {emailStatus === 'taken' && <span className="text-xs text-rose-500 mt-1 block">Email is taken</span>}
              </div>

              {isCreateModalOpen && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <PasswordInput
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter initial password"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}>Cancel</Button>
                <Button 
                  type="submit" 
                  className="bg-[#7C68EE] hover:bg-[#6b58d9] text-white"
                  disabled={usernameStatus === 'taken' || emailStatus === 'taken' || usernameStatus === 'checking' || emailStatus === 'checking'}
                >
                  {isCreateModalOpen ? 'Create User' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rose-100 mb-4">
              <Trash2 className="h-6 w-6 text-rose-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete User</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete <strong>{selectedUser.name}</strong>? This action will remove their access immediately.
            </p>
            <div className="flex gap-3">
              <Button className="flex-1" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
              <Button className="flex-1 bg-rose-600 hover:bg-rose-700 text-white" onClick={handleDelete}>Yes, Delete</Button>
            </div>
          </div>
        </div>
      )}

      {/* --- DEACTIVATE CONFIRMATION MODAL --- */}
      {isDeactivateModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 mb-4">
              <Power className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {selectedUser.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to {selectedUser.status === 'ACTIVE' ? 'deactivate' : 'activate'} <strong>{selectedUser.name}</strong>?
            </p>
            <div className="flex gap-3">
              <Button className="flex-1" variant="outline" onClick={() => setIsDeactivateModalOpen(false)}>Cancel</Button>
              <Button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white" onClick={handleToggleStatus}>Yes, Proceed</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
