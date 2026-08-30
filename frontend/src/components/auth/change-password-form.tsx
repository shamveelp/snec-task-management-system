"use client";

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { PasswordInput } from '../ui/password-input';
import { KeyRound, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '../../services/auth/auth.service';

export function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      setSaving(true);
      await authService.changePassword({ oldPassword, newPassword });
      toast.success('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden max-w-2xl mt-8">
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
          <KeyRound className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
          <p className="text-sm text-gray-500">Ensure your account is using a long, random password to stay secure.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Current Password</Label>
            <PasswordInput
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={saving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <PasswordInput
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={saving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <PasswordInput
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={saving}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <Button type="submit" disabled={saving} className="bg-[#7C68EE] hover:bg-[#6b58dd] text-white">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Changing...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Change Password
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
