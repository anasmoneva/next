import React, { useState, useEffect } from 'react'
import { supabase, Category } from '../../lib/supabase'
import { Plus, Edit, Save, X, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    actual_fee: 0,
    offer_fee: 0,
    image_url: '',
    popup_image_url: '',
    is_active: true
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const { error } = await supabase
        .from('categories')
        .insert([formData])

      if (error) throw error

      toast.success('Category added successfully')
      resetForm()
      fetchCategories()
    } catch (error) {
      console.error('Error adding category:', error)
      toast.error('Failed to add category')
    }
  }

  const handleEdit = async (id: string) => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const { error } = await supabase
        .from('categories')
        .update(formData)
        .eq('id', id)

      if (error) throw error

      toast.success('Category updated successfully')
      setEditingId(null)
      resetForm()
      fetchCategories()
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error('Failed to update category')
    }
  }

  const startEdit = (category: Category) => {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      description: category.description,
      actual_fee: category.actual_fee,
      offer_fee: category.offer_fee,
      image_url: category.image_url || '',
      popup_image_url: category.popup_image_url || '',
      is_active: category.is_active
    })
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      actual_fee: 0,
      offer_fee: 0,
      image_url: '',
      popup_image_url: '',
      is_active: true
    })
    setShowAddForm(false)
    setEditingId(null)
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error

      toast.success(`Category ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
      fetchCategories()
    } catch (error) {
      console.error('Error toggling category status:', error)
      toast.error('Failed to update category status')
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
        <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
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
                  Status
                </label>
                <select
                  className="select-field"
                  value={formData.is_active.toString()}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                className="input-field"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actual Fee (₹)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.actual_fee}
                  onChange={(e) => setFormData(prev => ({ ...prev, actual_fee: Number(e.target.value) }))}
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Fee (₹)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.offer_fee}
                  onChange={(e) => setFormData(prev => ({ ...prev, offer_fee: Number(e.target.value) }))}
                  min="0"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Image URL
                </label>
                <input
                  type="url"
                  className="input-field"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Success Popup Image URL
                </label>
                <input
                  type="url"
                  className="input-field"
                  value={formData.popup_image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, popup_image_url: e.target.value }))}
                  placeholder="https://example.com/popup-image.jpg"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Add Category
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="grid gap-6">
        {categories.map((category) => (
          <div key={category.id} className="card p-6">
            {editingId === category.id ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      className="select-field"
                      value={formData.is_active.toString()}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    className="input-field"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Actual Fee (₹)
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={formData.actual_fee}
                      onChange={(e) => setFormData(prev => ({ ...prev, actual_fee: Number(e.target.value) }))}
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Offer Fee (₹)
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={formData.offer_fee}
                      onChange={(e) => setFormData(prev => ({ ...prev, offer_fee: Number(e.target.value) }))}
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Image URL
                    </label>
                    <input
                      type="url"
                      className="input-field"
                      value={formData.image_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Success Popup Image URL
                    </label>
                    <input
                      type="url"
                      className="input-field"
                      value={formData.popup_image_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, popup_image_url: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEdit(category.id)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save size={18} />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={resetForm}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <X size={18} />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-gray-600 mt-1">{category.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      category.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => startEdit(category)}
                      className="text-primary-600 hover:text-primary-800"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Actual Fee</label>
                    <p className="text-lg font-semibold">₹{category.actual_fee}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Offer Fee</label>
                    <p className="text-lg font-semibold text-primary-600">
                      {category.offer_fee === 0 ? 'FREE' : `₹${category.offer_fee}`}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Category Image</label>
                    <p className="text-sm text-gray-600">
                      {category.image_url ? 'Set' : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Popup Image</label>
                    <p className="text-sm text-gray-600">
                      {category.popup_image_url ? 'Set' : 'Not set'}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => toggleActive(category.id, category.is_active)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      category.is_active
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {category.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No categories found. Add your first category to get started.</p>
        </div>
      )}
    </div>
  )
}

export default CategoryManagement