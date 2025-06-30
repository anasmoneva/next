import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Users, FileText, MapPin, Grid3X3, TrendingUp, Clock } from 'lucide-react'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    pendingRegistrations: 0,
    approvedRegistrations: 0,
    totalCategories: 0,
    totalPanchayaths: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch registration stats
      const { data: registrations, error: regError } = await supabase
        .from('registrations')
        .select('status')

      if (regError) throw regError

      const totalRegistrations = registrations?.length || 0
      const pendingRegistrations = registrations?.filter(r => r.status === 'pending').length || 0
      const approvedRegistrations = registrations?.filter(r => r.status === 'approved').length || 0

      // Fetch categories count
      const { count: categoriesCount, error: catError } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true })

      if (catError) throw catError

      // Fetch panchayaths count
      const { count: panchayathsCount, error: panError } = await supabase
        .from('panchayaths')
        .select('*', { count: 'exact', head: true })

      if (panError) throw panError

      setStats({
        totalRegistrations,
        pendingRegistrations,
        approvedRegistrations,
        totalCategories: categoriesCount || 0,
        totalPanchayaths: panchayathsCount || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to the E-LIFE SOCIETY admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Registrations</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalRegistrations}</p>
            </div>
            <Users className="w-12 h-12 text-primary-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approvals</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingRegistrations}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-600">{stats.approvedRegistrations}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCategories}</p>
            </div>
            <Grid3X3 className="w-12 h-12 text-primary-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Panchayaths</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPanchayaths}</p>
            </div>
            <MapPin className="w-12 h-12 text-primary-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-8">
        <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin/registrations"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-8 h-8 text-primary-600" />
            <div>
              <h3 className="font-semibold">Manage Registrations</h3>
              <p className="text-sm text-gray-600">View and manage all registrations</p>
            </div>
          </Link>

          <Link
            to="/admin/panchayaths"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MapPin className="w-8 h-8 text-primary-600" />
            <div>
              <h3 className="font-semibold">Manage Panchayaths</h3>
              <p className="text-sm text-gray-600">Add and manage panchayaths</p>
            </div>
          </Link>

          <Link
            to="/admin/categories"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Grid3X3 className="w-8 h-8 text-primary-600" />
            <div>
              <h3 className="font-semibold">Manage Categories</h3>
              <p className="text-sm text-gray-600">Update category fees and images</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard