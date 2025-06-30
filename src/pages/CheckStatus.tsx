import React, { useState } from 'react'
import { supabase, Registration } from '../lib/supabase'
import { Search, CheckCircle, Clock, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const CheckStatus = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [registration, setRegistration] = useState<Registration | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      toast.error('Please enter a customer ID or mobile number')
      return
    }

    setLoading(true)
    setSearched(true)

    try {
      let query = supabase
        .from('registrations')
        .select('*')

      // Check if search query is a mobile number (10 digits) or customer ID
      if (/^\d{10}$/.test(searchQuery)) {
        query = query.eq('mobile_number', searchQuery)
      } else {
        query = query.eq('customer_id', searchQuery.toUpperCase())
      }

      const { data, error } = await query.single()

      if (error) {
        if (error.code === 'PGRST116') {
          setRegistration(null)
          toast.error('No registration found with the provided details')
        } else {
          throw error
        }
      } else {
        setRegistration(data)
      }
    } catch (error) {
      console.error('Error searching registration:', error)
      toast.error('Failed to search registration. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-8 h-8 text-green-500" />
      case 'rejected':
        return <XCircle className="w-8 h-8 text-red-500" />
      default:
        return <Clock className="w-8 h-8 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50'
      case 'rejected':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-yellow-600 bg-yellow-50'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved'
      case 'rejected':
        return 'Rejected'
      default:
        return 'Pending Approval'
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Check Registration Status</h1>
        <p className="text-xl text-gray-600">
          Enter your customer ID or mobile number to check your application status
        </p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSearch} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer ID or Mobile Number
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                className="input-field flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Customer ID (e.g., ESEP9876543210A) or Mobile Number"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                <Search size={18} />
                <span>{loading ? 'Searching...' : 'Search'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {searched && registration && (
        <div className="card p-8">
          <div className="text-center mb-6">
            {getStatusIcon(registration.status)}
            <h2 className="text-2xl font-bold mt-4 mb-2">Registration Found</h2>
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(registration.status)}`}>
              {getStatusText(registration.status)}
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Customer ID</label>
                <p className="text-lg font-semibold">{registration.customer_id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Category</label>
                <p className="text-lg">{registration.category}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Name</label>
                <p className="text-lg">{registration.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Mobile Number</label>
                <p className="text-lg">{registration.mobile_number}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Address</label>
              <p className="text-lg">{registration.address}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Panchayath</label>
                <p className="text-lg">{registration.panchayath}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Ward</label>
                <p className="text-lg">{registration.ward}</p>
              </div>
            </div>

            {registration.agent_pro && (
              <div>
                <label className="block text-sm font-medium text-gray-500">Agent/P.R.O</label>
                <p className="text-lg">{registration.agent_pro}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-500">Applied On</label>
              <p className="text-lg">{new Date(registration.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {registration.status === 'pending' && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-800">
                <strong>Status:</strong> Your registration is currently under review. 
                You will be notified once the payment approval process is completed.
              </p>
            </div>
          )}

          {registration.status === 'approved' && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800">
                <strong>Congratulations!</strong> Your registration has been approved. 
                You can now start your self-employment journey with E-LIFE SOCIETY.
              </p>
            </div>
          )}

          {registration.status === 'rejected' && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg">
              <p className="text-red-800">
                <strong>Registration Rejected:</strong> Please contact our support team for more information 
                or to resubmit your application with the required corrections.
              </p>
            </div>
          )}
        </div>
      )}

      {searched && !registration && !loading && (
        <div className="card p-8 text-center">
          <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Registration Found</h3>
          <p className="text-gray-500">
            No registration was found with the provided customer ID or mobile number. 
            Please check your details and try again.
          </p>
        </div>
      )}
    </div>
  )
}

export default CheckStatus