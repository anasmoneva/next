import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, Category } from '../lib/supabase'
import { ArrowRight, Clock, Truck, Leaf, Utensils, Hammer, CreditCard } from 'lucide-react'

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

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
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase()
    if (name.includes('pennyekart free')) return <Truck className="w-8 h-8" />
    if (name.includes('pennyekart paid')) return <Clock className="w-8 h-8" />
    if (name.includes('farmelife')) return <Leaf className="w-8 h-8" />
    if (name.includes('organelife')) return <Leaf className="w-8 h-8" />
    if (name.includes('foodelife')) return <Utensils className="w-8 h-8" />
    if (name.includes('entrelife')) return <Hammer className="w-8 h-8" />
    if (name.includes('job card')) return <CreditCard className="w-8 h-8" />
    return <ArrowRight className="w-8 h-8" />
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
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Registration Categories</h1>
        <p className="text-xl text-gray-600">
          Choose the category that best fits your business goals
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="text-primary-600">
                {getCategoryIcon(category.name)}
              </div>
              {category.offer_fee < category.actual_fee && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  OFFER
                </span>
              )}
            </div>
            
            <h3 className="text-xl font-semibold mb-3">{category.name}</h3>
            <p className="text-gray-600 mb-4 line-clamp-3">{category.description}</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Registration Fee:</span>
                <div className="flex items-center space-x-2">
                  {category.offer_fee < category.actual_fee && (
                    <span className="text-gray-400 line-through">₹{category.actual_fee}</span>
                  )}
                  <span className="font-semibold text-primary-600">
                    {category.offer_fee === 0 ? 'FREE' : `₹${category.offer_fee}`}
                  </span>
                </div>
              </div>
            </div>
            
            <Link
              to={`/registration?category=${encodeURIComponent(category.name)}`}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <span>Register Now</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No categories available at the moment.</p>
        </div>
      )}
    </div>
  )
}

export default Categories