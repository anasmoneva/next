import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, Target, Award } from 'lucide-react'

const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to E-LIFE SOCIETY
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Empowering Self-Employment Through PennyeKart - A Hybrid E-commerce Platform
          </p>
          <Link
            to="/registration"
            className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <span>Start Registration</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="card p-8 text-center">
          <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-3">Self Employment</h3>
          <p className="text-gray-600">
            Join our community of entrepreneurs and start your own business with our support and platform.
          </p>
        </div>
        
        <div className="card p-8 text-center">
          <Target className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-3">Multiple Categories</h3>
          <p className="text-gray-600">
            Choose from various categories like FarmeLife, OrganeLife, FoodeLife, EntreLife, and more.
          </p>
        </div>
        
        <div className="card p-8 text-center">
          <Award className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-3">Hybrid Platform</h3>
          <p className="text-gray-600">
            Experience the unique combination of e-commerce and self-employment opportunities.
          </p>
        </div>
      </section>

      {/* Quick Status Check */}
      <section className="card p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Check Your Registration Status</h2>
          <p className="text-gray-600 mb-6">
            Enter your customer ID or mobile number to check your application status
          </p>
          <Link
            to="/check-status"
            className="btn-primary"
          >
            Check Status Now
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home