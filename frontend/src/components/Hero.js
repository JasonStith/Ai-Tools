import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient">
      {/* Animated Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-pink-800/60 to-blue-900/80 animate-gradient-xy"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-pink-200 font-medium"
            >
              Generate films, audio, and now — complete stories
            </motion.p>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Explore new ways to
              <span className="block bg-gradient-to-r from-pink-400 via-purple-300 to-orange-300 bg-clip-text text-transparent">
                create
              </span>
            </h1>
          </div>
          
          {/* Search Bar Style Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center bg-dark-800/80 backdrop-blur-md rounded-full border border-gray-700/50 p-2">
              <div className="flex items-center space-x-3 px-4 py-3 flex-1">
                <span className="text-gray-400">🎬</span>
                <input
                  type="text"
                  placeholder="Describe the film you want to create"
                  className="bg-transparent text-white placeholder-gray-400 flex-1 outline-none text-lg"
                />
              </div>
              <motion.button
                className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Generate
              </motion.button>
            </div>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center space-x-6 mt-8"
          >
            {['Featured', 'Script', 'Character', 'Environment', 'Animation'].map((category, index) => (
              <motion.button
                key={category}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                  index === 0 
                    ? 'bg-white/20 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-3xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-white mb-2">Complete Pipeline</h3>
            <p className="text-gray-300">From pre-production to distribution, all tools in one platform</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
            <p className="text-gray-300">Powered by state-of-the-art AI models via Replicate</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-3xl mb-4">🎨</div>
            <h3 className="text-xl font-semibent text-white mb-2">Creative Freedom</h3>
            <p className="text-gray-300">Unlimited possibilities with AI-powered creativity</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;