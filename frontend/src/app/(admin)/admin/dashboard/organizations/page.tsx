"use client";

import React, { useEffect, useState } from 'react';
import { adminService, AdminOrganizationData } from '../../../../../services/admin/admin.service';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Search, Plus, Building2, Edit2, Trash2 } from 'lucide-react';

export default function AdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState<AdminOrganizationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const res = await adminService.getOrganizations({ query, page, limit: 10 });
      setOrganizations(res.data);
      setTotalPages(res.meta.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchOrganizations();
  };

  const handleDelete = async (id: string) => {
    // Note: Implementation for delete org would go here if endpoint was fully supported
    if (confirm('Are you sure you want to delete this organization?')) {
        alert('Delete functionality placeholder');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organization Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage platform organizations and their details</p>
        </div>
        <Button className="bg-[#7C68EE] hover:bg-[#6b58d9] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Organization
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex items-center justify-between">
        <form onSubmit={handleSearch} className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email..." 
            className="pl-9 bg-gray-50/50 border-gray-200"
          />
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Organization</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading organizations...</td>
              </tr>
            ) : organizations.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No organizations found.</td>
              </tr>
            ) : (
              organizations.map(org => (
                <tr key={org.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200">
                          <Building2 className="h-4 w-4" />
                        </div>
                      <div>
                        <div className="font-medium text-gray-900">{org.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">Joined {new Date(org.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{org.email}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{org.mobile || 'No mobile'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {org.category || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-[#7C68EE] hover:bg-[#7C68EE]/10 rounded-lg transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(org.id)} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
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
    </div>
  );
}
