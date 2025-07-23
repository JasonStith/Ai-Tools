import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const MusicStudio = ({ onBack }) => {
  const [lyrics, setLyrics] = useState('');
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [isInstrumental, setIsInstrumental] = useState(false);
  const [songMode, setSongMode] = useState('Full Song');
  const [createdSongs, setCreatedSongs] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentView, setCurrentView] = useState('create'); // 'create' or 'workspace'

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  // Style tags similar to Suno
  const styleOptions = [
    'pop', 'rock', 'hip-hop', 'electronic', 'jazz', 'classical', 'country', 'reggae',
    'blues', 'folk', 'indie', 'alternative', 'metal', 'punk', 'r&b', 'soul',
    '70-80 bpm', '90-100 bpm', '120-140 bpm', '140+ bpm',
    'upbeat', 'mellow', 'energetic', 'chill', 'ambient', 'experimental'
  ];

  useEffect(() => {
    // Load created songs (mock data for now)
    setCreatedSongs([
      {
        id: '1',
        title: 'Untitled',
        subtitle: 'STrmp Countdown',
        duration: '2:24',
        genre: 'Electronic Pop',
        created: '2 days ago',
        status: 'completed'
      },
      {
        id: '2',
        title: 'Untitled',
        subtitle: 'STrmp Countdown',
        duration: '2:35',
        genre: 'Indie Rock',
        created: '3 days ago',
        status: 'completed'
      }
    ]);
  }, []);

  const toggleStyle = (style) => {
    setSelectedStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const generateMusic = async () => {
    try {
      setIsGenerating(true);
      
      const response = await axios.post(`${backendUrl}/api/tools/execute`, {
        tool_name: 'Music',
        inputs: {
          prompt: lyrics || 'Generate an instrumental track',
          style: selectedStyles.join(', '),
          mode: songMode,
          instrumental: isInstrumental
        }
      });

      // Add to created songs
      const newSong = {
        id: Date.now().toString(),
        title: 'Untitled',
        subtitle: 'AI Generated',
        duration: '2:30',
        genre: selectedStyles.slice(0, 2).join(', ') || 'AI Music',
        created: 'Just now',
        status: 'completed',
        result: response.data.result
      };

      setCreatedSongs(prev => [newSong, ...prev]);
      setCurrentView('workspace');
      
    } catch (error) {
      console.error('Error generating music:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-dark-900/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-400 hover:text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>←</span>
                <span>Back to Tools</span>
              </motion.button>
              
              <div className="text-2xl font-bold">SUNO</div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex bg-dark-800 rounded-lg p-1">
                <button
                  onClick={() => setCurrentView('create')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'create' ? 'bg-dark-700 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Create
                </button>
                <button
                  onClick={() => setCurrentView('workspace')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'workspace' ? 'bg-dark-700 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  My Workspace
                </button>
              </div>

              <button className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                Create your own song
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'create' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Creation Panel */}
            <div className="lg:col-span-1 space-y-6">
              {/* Mode Selection */}
              <div className="bg-dark-800 rounded-xl p-6">
                <div className="flex space-x-2 mb-4">
                  <button 
                    onClick={() => setSongMode('Simple')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      songMode === 'Simple' ? 'bg-dark-700 text-white' : 'bg-dark-700/50 text-gray-400 hover:text-white'
                    }`}
                  >
                    Simple
                  </button>
                  <button 
                    onClick={() => setSongMode('Custom')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      songMode === 'Custom' ? 'bg-dark-700 text-white' : 'bg-dark-700/50 text-gray-400 hover:text-white'
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {/* Creation Options */}
                <div className="space-y-4">
                  <button className="w-full bg-dark-700 hover:bg-dark-600 p-4 rounded-lg text-left transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🎵</span>
                      <span className="font-medium">Audio</span>
                    </div>
                  </button>
                  
                  <button className="w-full bg-dark-700 hover:bg-dark-600 p-4 rounded-lg text-left transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">👤</span>
                      <span className="font-medium">Persona</span>
                    </div>
                  </button>
                  
                  <button className="w-full bg-dark-700 hover:bg-dark-600 p-4 rounded-lg text-left transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">💡</span>
                      <span className="font-medium">Inspo</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Lyrics Section */}
              <div className="bg-dark-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">🎤 Lyrics</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Auto</span>
                    <button className="text-sm text-primary-400 hover:text-primary-300">
                      Write Lyrics
                    </button>
                  </div>
                </div>
                
                <textarea
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  className="w-full h-32 bg-dark-700 rounded-lg p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Add your own lyrics here"
                />

                <div className="mt-4 flex items-center">
                  <input
                    type="checkbox"
                    id="instrumental"
                    checked={isInstrumental}
                    onChange={(e) => setIsInstrumental(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="instrumental" className="text-sm text-gray-300">
                    Instrumental
                  </label>
                  <div className="ml-auto flex space-x-2">
                    <button 
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        songMode === 'By Line' ? 'bg-primary-500 text-white' : 'bg-dark-700 text-gray-400'
                      }`}
                      onClick={() => setSongMode('By Line')}
                    >
                      By Line
                    </button>
                    <button 
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        songMode === 'Full Song' ? 'bg-primary-500 text-white' : 'bg-dark-700 text-gray-400'
                      }`}
                      onClick={() => setSongMode('Full Song')}
                    >
                      Full Song
                    </button>
                  </div>
                </div>
              </div>

              {/* Styles Section */}
              <div className="bg-dark-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">🎨 Styles</h3>
                
                <input
                  type="text"
                  className="w-full bg-dark-700 rounded-lg p-3 text-white placeholder-gray-400 mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter style tags"
                />

                <div className="flex flex-wrap gap-2 mb-4">
                  {styleOptions.map((style) => (
                    <button
                      key={style}
                      onClick={() => toggleStyle(style)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        selectedStyles.includes(style)
                          ? 'bg-primary-500 text-white'
                          : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:text-white'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Options */}
              <div className="bg-dark-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Advanced Options</h3>
                  <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">NEW</span>
                </div>
              </div>

              {/* Create Button */}
              <motion.button
                onClick={generateMusic}
                disabled={isGenerating}
                className={`w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 rounded-xl transition-all duration-200 ${
                  isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:scale-105'
                }`}
                whileHover={!isGenerating ? { scale: 1.02 } : {}}
                whileTap={!isGenerating ? { scale: 0.98 } : {}}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  <>🎵 Create</>
                )}
              </motion.button>
            </div>

            {/* Right Side - New Features Banner */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-8 mb-8">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="bg-purple-500 text-white text-xs px-3 py-1 rounded-full uppercase font-bold mb-4 inline-block">
                      NEW FEATURES
                    </span>
                    <h2 className="text-4xl font-bold text-white mb-2">
                      Introducing v4.5+
                    </h2>
                    <h3 className="text-2xl font-semibold text-purple-100 mb-4">
                      New ways to create.
                    </h3>
                    <p className="text-purple-200 mb-6 max-w-md">
                      Unlock 4.5+ and push your sound further. Swap vocals, flip instrumentals, 
                      or spark a song from any playlist—it's creativity, upgraded.
                    </p>
                    <button className="bg-white text-purple-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                      Create now
                    </button>
                    <p className="text-purple-300 text-sm mt-2">
                      Available for Pro and Premier users
                    </p>
                  </div>
                  <div className="ml-8">
                    <div className="bg-gradient-to-br from-pink-500 to-orange-500 p-4 rounded-xl">
                      <div className="text-center">
                        <div className="bg-purple-600 text-white text-sm px-3 py-1 rounded-full mb-2">VOCALS</div>
                        <div className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">INSTRUMENTALS</div>
                      </div>
                    </div>
                    <p className="text-center text-purple-200 text-sm mt-2">
                      Add Vocals or Instrumentals<br />
                      Start with one layer, finish with a song.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Workspace View */
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <button className="text-gray-400">←</button>
                <h1 className="text-2xl font-bold">My Workspace</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 bg-dark-800 px-4 py-2 rounded-lg">
                  <span>🔍</span>
                  <span className="text-sm">Filters (3)</span>
                </button>
                <button className="flex items-center space-x-2 bg-dark-800 px-4 py-2 rounded-lg">
                  <span>❤️</span>
                  <span className="text-sm">Liked</span>
                </button>
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-dark-800 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Songs List */}
            <div className="space-y-4">
              {createdSongs.map((song) => (
                <div key={song.id} className="bg-dark-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🎵</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{song.title}</h3>
                      <p className="text-gray-400 text-sm">{song.subtitle}</p>
                      <p className="text-gray-500 text-xs">{song.genre} • {song.created}</p>
                    </div>
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {song.duration}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="bg-dark-700 hover:bg-dark-600 px-4 py-2 rounded-lg text-sm">
                      Edit
                    </button>
                    <button className="bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-lg text-sm text-white">
                      Publish
                    </button>
                    <button className="text-gray-400 hover:text-white p-2">⋯</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicStudio;