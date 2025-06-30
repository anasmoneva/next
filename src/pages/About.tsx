import React from 'react'

const About = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About E-LIFE SOCIETY</h1>
        <p className="text-xl text-gray-600">
          Revolutionizing Self-Employment Through Innovation
        </p>
      </div>

      <div className="card p-8">
        <h2 className="text-2xl font-semibold mb-4">What is PennyeKart?</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          PennyeKart is a revolutionary hybrid e-commerce platform that uniquely combines home delivery services 
          with comprehensive self-employment programs through E-LIFE SOCIETY. This innovative approach creates 
          opportunities for individuals to build sustainable businesses while serving their communities.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Our platform connects entrepreneurs with customers through various specialized categories, each designed 
          to support different types of businesses and skill sets.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-3 text-primary-600">Our Mission</h3>
          <p className="text-gray-700">
            To empower individuals with sustainable self-employment opportunities while building a strong 
            community-driven economy that benefits everyone involved.
          </p>
        </div>
        
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-3 text-primary-600">Our Vision</h3>
          <p className="text-gray-700">
            To create the largest network of self-employed entrepreneurs in India, fostering economic growth 
            and community development through innovative technology solutions.
          </p>
        </div>
      </div>

      <div className="card p-8">
        <h2 className="text-2xl font-semibold mb-6">Why Choose E-LIFE SOCIETY?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">✓ Comprehensive Support</h4>
            <p className="text-gray-600 mb-4">Complete guidance and support for your business journey</p>
            
            <h4 className="font-semibold mb-2">✓ Multiple Categories</h4>
            <p className="text-gray-600 mb-4">Various business opportunities to match your skills</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">✓ Technology Platform</h4>
            <p className="text-gray-600 mb-4">Modern e-commerce platform with delivery services</p>
            
            <h4 className="font-semibold mb-2">✓ Community Network</h4>
            <p className="text-gray-600 mb-4">Strong network of entrepreneurs and customers</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About