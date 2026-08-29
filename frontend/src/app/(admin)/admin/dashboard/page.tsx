import React from 'react';
import { Users, Building2, Activity, ArrowUpRight } from 'lucide-react';

export default function AdminDashboardOverview() {
  const stats = [
    { name: 'Total Users', value: '1,248', change: '+12%', icon: Users },
    { name: 'Active Organizations', value: '45', change: '+4%', icon: Building2 },
    { name: 'System Load', value: '24%', change: '-2%', icon: Activity },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Platform statistics and system health</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-[#7C68EE]/10 flex items-center justify-center text-[#7C68EE]">
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="flex items-center text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-1 rounded-md">
                {stat.change}
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
