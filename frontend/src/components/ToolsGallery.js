import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const ToolsGallery = ({ onToolSelect }) => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Tools', icon: '🔧' },
    { id: 'Pre-Production', label: 'Pre-Production', icon: '📋' },
    { id: 'Production', label: 'Production', icon: '🎬' },
    { id: 'Post-Production', label: 'Post-Production', icon: '✂️' },
    { id: 'Distribution', label: 'Distribution', icon: '🌐' },
  ];

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/tools`);
      setTools(response.data.tools);
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTools = selectedCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory);

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Pre-Production':
        return 'category-badge category-pre-production';
      case 'Production':
        return 'category-badge category-production';
      case 'Post-Production':
        return 'category-badge category-post-production';
      case 'Distribution':
        return 'category-badge category-distribution';
      default:
        return 'category-badge bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
        >
          AI Filmmaking Tools
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Explore our comprehensive suite of AI-powered tools designed to streamline your filmmaking process
        </motion.p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{category.icon}</span>
            <span className="font-medium">{category.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredTools.map((tool, index) => (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="tool-card p-6 cursor-pointer"
            onClick={() => onToolSelect(tool)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">{tool.icon}</div>
              <span className={getCategoryBadgeClass(tool.category)}>
                {tool.category}
              </span>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {tool.name}
            </h3>
            
            <p className="text-gray-600 mb-4 text-sm">
              {tool.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Powered by Replicate
              </span>
              <motion.button
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                whileHover={{ scale: 1.05 }}
              >
                Try Now →
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No tools found in this category.</p>
        </div>
      )}
    </section>
  );
};

export default ToolsGallery;