"use client";

import * as React from "react";
import { useAuthStore } from "../../../../store/auth.store";
import { ProtectedRoute } from "../../../../components/auth/protected-route";
import { Button } from "../../../../components/ui/button";

export default function OrganizationDashboardPage() {
  const { user, logout } = useAuthStore();

  return (
    <ProtectedRoute allowedRoles={["Organization Admin"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Organization Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-300">
                Welcome, {user?.name || user?.username}
              </span>
              <Button onClick={() => logout()} variant="outline">
                Logout
              </Button>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome to the Organization Admin dashboard. You can manage your organization settings and members here.
            </p>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
