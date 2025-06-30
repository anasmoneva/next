import React, { useState, useEffect } from 'react'
import { supabase, Registration } from '../../lib/supabase'
import { Edit, Filter, Download, CheckCircle, XCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'

const RegistrationManagement = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    panchayath: '',
    status: ''
  })
  const [categories, setCategories] = useState<string[]>([])
  const [panchayaths, setPanchayaths] = useState<string[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editCategory, setEditCategory] = useState('')

  useEffect(() => {
    fetchRegistrations()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [registrations, filters])

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setRegistrations(data || [])
      
      // Extract unique categories and panchayaths for filters
      const uniqueCategories = [...new Set(data?.map(r => r.category) || [])]
      const uniquePanchayaths = [...new Set(data?.map(r => r.panchayath) || [])]
      
      setCategories(uniqueCategories)
      setPanchayaths(uniquePanchayaths)
    } catch (error) {
      console.error('Error fetching registrations:', error)
      toast.error('Failed to fetch registrations')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = registrations

    if (filters.category) {
      filtered = filtered.filter(r => r.category === filters.category)
    }

    if (filters.panchayath) {
      filtered = filtered.filter(r => r.panchayath === filters.panchayath)
    }

    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status)
    }

    setFilteredRegistrations(filtered)
  }

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      setRegistrations(prev => 
        prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
      )
      toast.success(`Registration ${newStatus} successfully`)
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  const handleCategoryEdit = async (id: string) => {
    if (!editCategory) {
      toast.error('Please select a category')
      return
    }

    try {
      const { error } = await supabase
        .from('registrations')
        .update({ category: editCategory, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      setRegistrations(prev => 
        prev.map(r => r.id === id ? { ...r, category: editCategory } : r)
      )
      setEditingId(null)
      setEditCategory('')
      toast.success('Category updated successfully')
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error('Failed to update category')
    }
  }

  const exportToExcel = () => {
    const exportData = filteredRegistrations.map(reg => ({
      'Customer ID': reg.customer_id,
      'Name': reg.name,
      'Mobile Number': reg.mobile_number,
      'Category': reg.category,
      'Address': reg.address,
      'Panchayath': reg.panchayath,
      'Ward': reg.ward,
      'Agent/PRO': reg.agent_pro || '',
      'Status': reg.status,
      'Applied Date': new Date(reg.created_at).toLocaleDateString(),
      'Updated Date': new Date(reg.updated_at).toLocaleDateString()
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Registrations')
    XLSX.writeFile(wb, `registrations_${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success('Data exported successfully')
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold"
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Registration Management</h1>
        <button
          onClick={exportToExcel}
          className="btn-primary flex items-center space-x-2"
        >
          <Download size={18} />
          <span>Export to Excel</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter size={18} className="text-gray-600" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              className="select-field"
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Panchayath</label>
            <select
              className="select-field"
              value={filters.panchayath}
              onChange={(e) => setFilters(prev => ({ ...prev, panchayath: e.target.value }))}
            >
              <option value="">All Panchayaths</option>
              {panchayaths.map(panchayath => (
                <option key={panchayath} value={panchayath}>{panchayath}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              className="select-field"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegistrations.map((registration) => (
                <tr key={registration.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{registration.name}</div>
                      <div className="text-sm text-gray-500">{registration.customer_id}</div>
                      <div className="text-sm text-gray-500">{registration.mobile_number}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === registration.id ? (
                      <div className="flex items-center space-x-2">
                        <select
                          className="select-field text-sm"
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                        >
                          <option value="">Select Category</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleCategoryEdit(registration.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null)
                            setEditCategory('')
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">{registration.category}</span>
                        <button
                          onClick={() => {
                            setEditingId(registration.id)
                            setEditCategory(registration.category)
                          }}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{registration.panchayath}</div>
                    <div className="text-sm text-gray-500">Ward: {registration.ward}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(registration.status)}>
                      {registration.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {registration.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(registration.id, 'approved')}
                            className="text-green-600 hover:text-green-800"
                            title="Approve"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => handleStatusChange(registration.id, 'rejected')}
                            className="text-red-600 hover:text-red-800"
                            title="Reject"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                      {registration.status !== 'pending' && (
                        <button
                          onClick={() => handleStatusChange(registration.id, 'pending')}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Mark as Pending"
                        >
                          <Clock size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRegistrations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No registrations found matching the current filters.</p>
        </div>
      )}
    </div>
  )
}

export default RegistrationManagement