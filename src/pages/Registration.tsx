import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { supabase, Category, Panchayath } from '../lib/supabase'
import toast from 'react-hot-toast'

const Registration = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const selectedCategory = searchParams.get('category')

  const [categories, setCategories] = useState<Category[]>([])
  const [panchayaths, setPanchayaths] = useState<Panchayath[]>([])
  const [selectedCategoryData, setSelectedCategoryData] = useState<Category | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    category: selectedCategory || '',
    name: '',
    address: '',
    mobile_number: '',
    panchayath: '',
    ward: '',
    agent_pro: ''
  })

  useEffect(() => {
    fetchCategories()
    fetchPanchayaths()
  }, [])

  useEffect(() => {
    if (selectedCategory && categories.length > 0) {
      const category = categories.find(c => c.name === selectedCategory)
      if (category) {
        setSelectedCategoryData(category)
        setFormData(prev => ({ ...prev, category: selectedCategory }))
      }
    }
  }, [selectedCategory, categories])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

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
    }
  }

  const generateCustomerId = (mobileNumber: string, name: string) => {
    const firstLetter = name.charAt(0).toUpperCase()
    return `ESEP${mobileNumber}${firstLetter}`
  }

  const checkDuplicateRegistration = async (mobileNumber: string) => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('id')
        .eq('mobile_number', mobileNumber)
        .limit(1)

      if (error) throw error
      return data && data.length > 0
    } catch (error) {
      console.error('Error checking duplicate registration:', error)
      return false
    }
  }

  const handleCategoryChange = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName)
    setSelectedCategoryData(category || null)
    setFormData(prev => ({ ...prev, category: categoryName }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate form
      if (!formData.category || !formData.name || !formData.address || 
          !formData.mobile_number || !formData.panchayath || !formData.ward) {
        toast.error('Please fill in all required fields')
        return
      }

      // Validate mobile number
      if (!/^\d{10}$/.test(formData.mobile_number)) {
        toast.error('Please enter a valid 10-digit mobile number')
        return
      }

      // Check for duplicate registration
      const isDuplicate = await checkDuplicateRegistration(formData.mobile_number)
      if (isDuplicate) {
        toast.error('A registration already exists with this mobile number')
        return
      }

      // Generate customer ID
      const customerId = generateCustomerId(formData.mobile_number, formData.name)

      // Insert registration
      const { error } = await supabase
        .from('registrations')
        .insert([{
          customer_id: customerId,
          category: formData.category,
          name: formData.name,
          address: formData.address,
          mobile_number: formData.mobile_number,
          panchayath: formData.panchayath,
          ward: formData.ward,
          agent_pro: formData.agent_pro,
          status: 'pending'
        }])

      if (error) throw error

      // Show success popup
      setShowPopup(true)
      toast.success('Registration submitted successfully!')

    } catch (error) {
      console.error('Error submitting registration:', error)
      toast.error('Failed to submit registration. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePopupClose = () => {
    setShowPopup(false)
    navigate('/check-status')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Registration Form</h1>
        <p className="text-xl text-gray-600">
          Join E-LIFE SOCIETY and start your self-employment journey
        </p>
      </div>

      {/* Category Selection */}
      {!selectedCategory && (
        <div className="card p-6">
          <h2 className="text-2xl font-semibold mb-4">Select Category</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.category === category.name
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
                onClick={() => handleCategoryChange(category.name)}
              >
                <h3 className="font-semibold mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Fee:</span>
                  <div className="flex items-center space-x-2">
                    {category.offer_fee < category.actual_fee && (
                      <span className="text-xs text-gray-400 line-through">₹{category.actual_fee}</span>
                    )}
                    <span className="font-semibold text-primary-600">
                      {category.offer_fee === 0 ? 'FREE' : `₹${category.offer_fee}`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Registration Form */}
      {(selectedCategory || formData.category) && selectedCategoryData && (
        <div className="card p-8">
          <div className="mb-6 p-4 bg-primary-50 rounded-lg">
            <h3 className="font-semibold text-primary-800 mb-2">Selected Category: {selectedCategoryData.name}</h3>
            <p className="text-sm text-primary-700 mb-2">{selectedCategoryData.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-primary-600">Registration Fee:</span>
              <div className="flex items-center space-x-2">
                {selectedCategoryData.offer_fee < selectedCategoryData.actual_fee && (
                  <span className="text-sm text-gray-400 line-through">₹{selectedCategoryData.actual_fee}</span>
                )}
                <span className="font-bold text-primary-800">
                  {selectedCategoryData.offer_fee === 0 ? 'FREE' : `₹${selectedCategoryData.offer_fee}`}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
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
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  className="input-field"
                  value={formData.mobile_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, mobile_number: e.target.value }))}
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                className="input-field"
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Panchayath *
                </label>
                <select
                  className="select-field"
                  value={formData.panchayath}
                  onChange={(e) => setFormData(prev => ({ ...prev, panchayath: e.target.value }))}
                  required
                >
                  <option value="">Select Panchayath</option>
                  {panchayaths.map((panchayath) => (
                    <option key={panchayath.id} value={panchayath.name}>
                      {panchayath.name} - {panchayath.district}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ward *
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.ward}
                  onChange={(e) => setFormData(prev => ({ ...prev, ward: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent/P.R.O
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.agent_pro}
                onChange={(e) => setFormData(prev => ({ ...prev, agent_pro: e.target.value }))}
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success Popup */}
      {showPopup && selectedCategoryData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4">
            {selectedCategoryData.popup_image_url && (
              <img
                src={selectedCategoryData.popup_image_url}
                alt="Success"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h3 className="text-2xl font-bold text-center mb-4 text-green-600">
              Registration Successful!
            </h3>
            <p className="text-center text-gray-600 mb-6">
              Your registration has been submitted successfully. You will receive a confirmation once approved.
            </p>
            <div className="text-center">
              <button
                onClick={handlePopupClose}
                className="btn-primary"
              >
                Check Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Registration