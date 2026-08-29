"use client"

import * as React from "react"
import { Search, Building2, Users, Calendar, ArrowUpDown, MoreHorizontal, ArrowRight, Star } from "lucide-react"
import { organizationsApi, OrganizationData } from "../../../../../lib/api/organizations.api"
import { useAuthStore } from "../../../../../store/auth.store"
import { SecondarySidebar } from "../../../../../components/user-dashboard/secondary-sidebar"
import { DashboardSidebarContext } from "../../layout"
import { useRouter } from "next/navigation"

export default function AllOrganizationsPage() {
  const { isPrimaryExpanded, toggleSidebar } = React.useContext(DashboardSidebarContext)
  const { user } = useAuthStore()
  const router = useRouter()

  const [organizations, setOrganizations] = React.useState<OrganizationData[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [sortField, setSortField] = React.useState<"name" | "memberCount" | "createdAt">("createdAt")
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc")

  React.useEffect(() => {
    loadOrganizations()
  }, [])

  const loadOrganizations = async () => {
    try {
      setIsLoading(true)
      const data = await organizationsApi.getJoinedOrganizations()
      setOrganizations(data)
    } catch (error) {
      console.error("Failed to load organizations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSort = (field: "name" | "memberCount" | "createdAt") => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDir("desc")
    }
  }

  const filteredAndSortedOrganizations = React.useMemo(() => {
    return organizations
      .filter((org) => {
        const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              org.category.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch
      })
      .sort((a, b) => {
        let comparison = 0
        if (sortField === "name") {
          comparison = a.name.localeCompare(b.name)
        } else if (sortField === "memberCount") {
          comparison = a.memberCount - b.memberCount
        } else if (sortField === "createdAt") {
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        }
        return sortDir === "asc" ? comparison : -comparison
      })
  }, [organizations, searchQuery, sortField, sortDir])

  return (
    <div className="flex flex-1 overflow-hidden w-full h-full">
      <SecondarySidebar 
        isExpanded={!isPrimaryExpanded}
        onExpand={() => toggleSidebar?.()}
      />
      
      <div className="flex-1 overflow-y-auto stylish-scrollbar-dark px-8 pb-8 pt-[104px] bg-[#131417]">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white/90">Joined Organizations</h1>
            <p className="text-white/40 mt-1">Manage the organizations you are a member of.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-[#1C1E24] border border-white/[0.04] rounded-xl flex items-center px-4 py-2.5 w-64">
              <Search className="h-4 w-4 text-white/40 mr-2 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="Search by name or category..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-white/40"
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-[#1C1E24] border border-white/[0.04] rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-white/40">Loading organizations...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.04] bg-white/[0.02]">
                    <th className="py-4 px-6 text-xs font-semibold text-white/40 uppercase tracking-wider">
                      <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("name")}>
                        Organization <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="py-4 px-6 text-xs font-semibold text-white/40 uppercase tracking-wider">Category</th>
                    <th className="py-4 px-6 text-xs font-semibold text-white/40 uppercase tracking-wider">
                      <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("memberCount")}>
                        Members <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="py-4 px-6 text-xs font-semibold text-white/40 uppercase tracking-wider">
                      <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("createdAt")}>
                        Registered On <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="py-4 px-6 text-right text-xs font-semibold text-white/40 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredAndSortedOrganizations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-white/40 text-sm">
                        No organizations found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedOrganizations.map((org) => {
                      const isMember = user?.organizationId === org.id
                      
                      return (
                        <tr key={org.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] p-[1px]">
                                <div className="h-full w-full bg-[#1C1E24] rounded-xl flex items-center justify-center">
                                  <span className="text-sm font-bold text-white">{org.name.charAt(0)}</span>
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-white group-hover:text-[#3B82F6] transition-colors flex items-center gap-2">
                                  {org.name}
                                  {isMember && <Star className="h-3 w-3 text-[#EAB308] fill-[#EAB308]" title="Your Organization" />}
                                </div>
                                <div className="text-[10px] text-white/40 mt-0.5">ID: {org.id.split('-')[0]}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-medium text-white/70">
                              <Building2 className="h-3 w-3" /> {org.category}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-1.5 text-sm text-white/70">
                              <Users className="h-4 w-4 text-white/40" /> {org.memberCount}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-1.5 text-sm text-white/70">
                              <Calendar className="h-4 w-4 text-white/40" />
                              {new Date(org.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            {isMember ? (
                              <button 
                                onClick={() => router.push('/organization/dashboard')}
                                className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#3B82F6]/10 text-[#3B82F6] hover:bg-[#3B82F6]/20 transition-colors"
                              >
                                Dashboard <ArrowRight className="h-3 w-3" />
                              </button>
                            ) : (
                              <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
