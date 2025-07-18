import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1549320671-cf994fc7f24e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxBSSUyMGZpbG1tYWtpbmd8ZW58MHx8fHB1cnBsZXwxNzUyODA4MTY0fDA&ixlib=rb-4.1.0&q=85"
          alt="AI Filmmaking"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-blue-900/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Create with
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> AI</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
            Transform your creative vision into reality with our comprehensive AI filmmaking pipeline. 
            From script to screen, powered by cutting-edge AI technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              className="btn-primary text-lg px-8 py-4 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Creating
            </motion.button>
            <motion.button
              className="btn-secondary text-lg px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Watch Demo
            </motion.button>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-white mb-2">Complete Pipeline</h3>
            <p className="text-gray-300">From pre-production to distribution, all tools in one platform</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
            <p className="text-gray-300">Powered by state-of-the-art AI models via Replicate</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-white mb-2">Creative Freedom</h3>
            <p className="text-gray-300">Unlimited possibilities with AI-powered creativity</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;