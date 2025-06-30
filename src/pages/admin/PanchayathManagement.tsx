import React, { useState, useEffect } from 'react'
import { supabase, Panchayath } from '../../lib/supabase'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'

const PanchayathManagement = () => {
  const [panchayaths, setPanchayaths] = useState<Panchayath[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    district: ''
  })

  useEffect(() => {
    fetchPanchayaths()
  }, [])

  const fetchPanchayaths = async () => {
    try {
      const { data, error } = await supabase
        .from('panchayaths')
        .select('*')
        .order('name')

      if (error) throw error
      setPanchayaths(data || [])
    } catch (error) {
      console.error('Error fetching panchayaths:', error)
      toast.error('Failed to fetch panchayaths')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.district.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const { error } = await supabase
        .from('panchayaths')
        .insert([formData])

      if (error) throw error

      toast.success('Panchayath added successfully')
      setFormData({ name: '', district: '' })
      setShowAddForm(false)
      fetchPanchayaths()
    } catch (error) {
      console.error('Error adding panchayath:', error)
      toast.error('Failed to add panchayath')
    }
  }

  const handleEdit = async (id: string) => {
    if (!formData.name.trim() || !formData.district.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const { error } = await supabase
        .from('panchayaths')
        .update(formData)
        .eq('id', id)

      if (error) throw error

      toast.success('Panchayath updated successfully')
      setEditingId(null)
      setFormData({ name: '', district: '' })
      fetchPanchayaths()
    } catch (error) {
      console.error('Error updating panchayath:', error)
      toast.error('Failed to update panchayath')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this panchayath?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('panchayaths')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Panchayath deleted successfully')
      fetchPanchayaths()
    } catch (error) {
      console.error('Error deleting panchayath:', error)
      toast.error('Failed to delete panchayath')
    }
  }

  const startEdit = (panchayath: Panchayath) => {
    setEditingId(panchayath.id)
    setFormData({
      name: panchayath.name,
      district: panchayath.district
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData({ name: '', district: '' })
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
        <h1 className="text-3xl font-bold text-gray-900">Panchayath Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add Panchayath</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Panchayath</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Panchayath Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.district}
                  onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Add Panchayath
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setFormData({ name: '', district: '' })
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Panchayaths List */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Panchayath Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  District
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {panchayaths.map((panchayath) => (
                <tr key={panchayath.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === panchayath.id ? (
                      <input
                        type="text"
                        className="input-field"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">{panchayath.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === panchayath.id ? (
                      <input
                        type="text"
                        className="input-field"
                        value={formData.district}
                        onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                      />
                    ) : (
                      <div className="text-sm text-gray-900">{panchayath.district}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(panchayath.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {editingId === panchayath.id ? (
                        <>
                          <button
                            onClick={() => handleEdit(panchayath.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Save"
                          >
                            <Save size={18} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-600 hover:text-gray-800"
                            title="Cancel"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(panchayath)}
                            className="text-primary-600 hover:text-primary-800"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(panchayath.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {panchayaths.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No panchayaths found. Add your first panchayath to get started.</p>
        </div>
      )}
    </div>
  )
}

export default PanchayathManagement