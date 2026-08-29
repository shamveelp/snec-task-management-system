"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { organizationsService } from '../../../../services/organization/organizations.service';
import { Loader2, Save, Building, Mail, Phone, Tag } from 'lucide-react';
import { toast } from 'sonner';

export default function OrganizationSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    category: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await organizationsService.getSettings();
      setFormData({
        name: data.name || '',
        email: data.email || '',
        mobile: data.mobile || '',
        category: data.category || '',
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load organization settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await organizationsService.updateSettings({
        name: formData.name,
        category: formData.category,
        mobile: formData.mobile,
      });
      toast.success('Organization settings updated successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update organization settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#F8F9FA]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full px-10 pb-10 gap-8 bg-[#F8F9FA] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mt-8">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">Organization Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your organization's profile and preferences.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden max-w-2xl">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Building className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">General Information</h2>
            <p className="text-sm text-gray-500">Update the basic information of your organization.</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Enter organization name"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address (Read-only)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  className="pl-9 bg-gray-50 text-gray-500 cursor-not-allowed"
                  disabled
                />
              </div>
              <p className="text-xs text-gray-400">Email address cannot be changed as it is used for primary identification.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mobile">Contact Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    id="mobile" 
                    name="mobile" 
                    value={formData.mobile} 
                    onChange={handleInputChange} 
                    placeholder="Enter mobile number"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    id="category" 
                    name="category" 
                    value={formData.category} 
                    onChange={handleInputChange} 
                    placeholder="e.g. IT, Healthcare"
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <Button type="submit" disabled={saving} className="bg-[#7C68EE] hover:bg-[#6b58dd] text-white">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
