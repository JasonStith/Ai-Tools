import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const StoryboardBuilder = ({ onBack }) => {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'editor'
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [projectSettings, setProjectSettings] = useState({
    name: '',
    aspectRatio: '16:9',
    videoStyle: 'Cinematic',
    styleReference: null,
    cinematicInspiration: ''
  });
  const [cast, setCast] = useState([]);
  const [storyboardFrames, setStoryboardFrames] = useState([]);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  const recentProjects = [
    "The Wings of Change",
    "Epic Quest for Glory", 
    "Mystery of the Lost Temple",
    "Urban Legends"
  ];

  const creativeTools = [
    {
      id: 'new-storyboard',
      title: 'New Storyboard',
      subtitle: 'Craft your story, shot by shot',
      icon: '📋',
      gradient: 'from-blue-600 to-purple-600',
      action: 'Create Storyboard'
    },
    {
      id: 'generate-motion',
      title: 'Generate Motion',
      subtitle: 'Set an image in motion in the video Gen Space',
      icon: '🎬',
      gradient: 'from-green-500 to-teal-500',
      action: 'Generate Motion'
    },
    {
      id: 'ai-powered-video',
      title: 'AI-Powered Video',
      subtitle: 'Make a concept or a script come to life',
      icon: '🎥',
      gradient: 'from-orange-500 to-red-500',
      action: 'Generate Storyboard'
    },
    {
      id: 'generate-images',
      title: 'Generate Images',
      subtitle: 'Explore your image-storming Gen Space',
      icon: '🖼️',
      gradient: 'from-pink-500 to-purple-500',
      action: 'Generate Images'
    },
    {
      id: 'blank-storyboard',
      title: 'Blank Storyboard',
      subtitle: 'Start from scratch with empty frames',
      icon: '📝',
      gradient: 'from-gray-600 to-gray-800',
      action: 'Create Blank'
    },
    {
      id: 'create-actor',
      title: 'Create an Actor',
      subtitle: 'Create realistic & consistent models',
      icon: '👤',
      gradient: 'from-indigo-500 to-blue-600',
      action: 'Create Actor'
    }
  ];

  const videoStyles = [
    { id: 'none', name: 'None', preview: null },
    { id: 'cinematic', name: 'Cinematic', preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoNDVkZWcsICMxZTQwYWYgMCUsICM5MzM1ZmYgMTAwJSkiLz4KPHN2ZyB4PSIyMCIgeT0iMTUiIHdpZHRoPSI0MCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDQwIDMwIiBmaWxsPSJ3aGl0ZSI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIzMCIgZmlsbD0idHJhbnNwYXJlbnQiLz4KPHN2ZyB4PSIxMCIgeT0iNSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiIGZpbGw9IndoaXRlIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iOCIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4=' },
    { id: 'vintage', name: 'Vintage', preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoNDVkZWcsICM5MjQwMGQgMCUsICNmZjk5MDAgMTAwJSkiLz4KPGN2ZyB4PSIyMCIgeT0iMTUiIHdpZHRoPSI0MCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDQwIDMwIiBmaWxsPSJ3aGl0ZSI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIzMCIgZmlsbD0idHJhbnNwYXJlbnQiLz4KPC9zdmc+Cjwvc3ZnPg==' },
    { id: 'lowkey', name: 'Low Key', preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoNDVkZWcsICMxMTExMTEgMCUsICM0NDQ0NDQgMTAwJSkiLz4KPGN2ZyB4PSIyMCIgeT0iMTUiIHdpZHRoPSI0MCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDQwIDMwIiBmaWxsPSJ3aGl0ZSI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIzMCIgZmlsbD0idHJhbnNwYXJlbnQiLz4KPC9zdmc+Cjwvc3ZnPg==' }
  ];

  const aspectRatios = [
    { id: '16:9', label: '16:9', active: true },
    { id: '1:1', label: '1:1', active: false },
    { id: '9:16', label: '9:16', active: false }
  ];

  // Mock projects data
  useEffect(() => {
    const mockProjects = [
      { id: 1, title: 'The Wings of Change', thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoNDVkZWcsICMzYjgyZjYgMCUsICM5MzMzZWEgMTAwJSkiLz4KPHN2ZyB4PSI0MCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIiBmaWxsPSJ3aGl0ZSI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0idHJhbnNwYXJlbnQiLz4KPC9zdmc+Cjwvc3ZnPg==', updated: '2 days ago' },
      { id: 2, title: 'Epic Quest for Glory', thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoNDVkZWcsICNmOTczMTYgMCUsICNlZDRjMGQgMTAwJSkiLz4KPHN2ZyB4PSI0MCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIiBmaWxsPSJ3aGl0ZSI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0idHJhbnNwYXJlbnQiLz4KPC9zdmc+Cjwvc3ZnPg==', updated: '1 week ago' },
      { id: 3, title: 'Mystery of the Lost Temple', thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoNDVkZWcsICNlZDRjMGQgMCUsICNkYzI2MjYgMTAwJSkiLz4KPHN2ZyB4PSI0MCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIiBmaWxsPSJ3aGl0ZSI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0idHJhbnNwYXJlbnQiLz4KPC9zdmc+Cjwvc3ZnPg==', updated: '2 weeks ago' }
    ];
    setProjects(mockProjects);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          setProjectSettings(prev => ({
            ...prev,
            styleReference: e.target.result
          }));
        };
        reader.readAsDataURL(file);
      }
    },
    maxFiles: 1
  });

  const startNewProject = (toolId) => {
    setCurrentProject({
      id: Date.now(),
      title: 'Untitled Storyboard',
      type: toolId
    });
    setCurrentView('editor');
  };

  const addCharacter = () => {
    const newCharacter = {
      id: Date.now(),
      name: `Character ${cast.length + 1}`,
      avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoNDVkZWcsICM2MzY2ZjEgMCUsICNhODU1ZjcgMTAwJSkiIHJ4PSI4Ii8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+👤PC90ZXh0Pgo8L3N2Zz4='
    };
    setCast([...cast, newCharacter]);
  };

  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="border-b border-gray-800">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={onBack}
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Back to Tools
              </motion.button>
              <div className="text-2xl font-bold">LTX Studio</div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Left Sidebar */}
          <div className="w-64 border-r border-gray-800 p-6">
            <nav className="space-y-2 mb-8">
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-800 text-white">
                <span>🏠</span>
                <span>Home</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer">
                <span>📁</span>
                <span>My Assets</span>
              </div>
            </nav>

            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">Recent</h3>
              <div className="space-y-2">
                {recentProjects.map((project, index) => (
                  <div key={index} className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 cursor-pointer transition-colors">
                    <span>📋</span>
                    <span className="text-sm truncate">{project}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">Creative Tools</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 cursor-pointer transition-colors">
                  <span>📋</span>
                  <span className="text-sm">New Storyboard</span>
                </div>
                <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 cursor-pointer transition-colors">
                  <span>🎬</span>
                  <span className="text-sm">Generate Motion</span>
                </div>
                <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 cursor-pointer transition-colors">
                  <span>🖼️</span>
                  <span className="text-sm">Generate Images</span>
                </div>
                <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-green-600 text-white cursor-pointer">
                  <span>🎥</span>
                  <span className="text-sm flex items-center">
                    Veo 3 <span className="ml-1 text-xs bg-blue-500 px-1 rounded">NEW</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            {/* Creative Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {creativeTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative h-64 rounded-2xl overflow-hidden cursor-pointer group bg-gradient-to-br ${tool.gradient}`}
                  onClick={() => startNewProject(tool.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  
                  {/* Content */}
                  <div className="relative h-full p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="text-4xl">{tool.icon}</div>
                      {tool.id === 'generate-motion' && (
                        <div className="flex space-x-2">
                          <span className="bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">Veo 3</span>
                          <span className="bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">LTXV</span>
                        </div>
                      )}
                      {tool.id === 'generate-images' && (
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">⚠️ FLUX.1 Kontext</span>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{tool.title}</h3>
                      <p className="text-white/80 mb-4">{tool.subtitle}</p>
                      <motion.button
                        className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {tool.action}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* My Projects */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">My Projects</h2>
                <div className="flex space-x-4">
                  <button className="text-white border-b-2 border-white pb-1">All Projects</button>
                  <button className="text-gray-400 hover:text-white transition-colors">Shared Projects</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    className="group cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setCurrentProject(project);
                      setCurrentView('editor');
                    }}
                  >
                    <div className="aspect-video rounded-lg overflow-hidden mb-2">
                      <img 
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-sm font-medium text-white truncate">{project.title}</h3>
                    <p className="text-xs text-gray-400">{project.updated}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Editor View
  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Settings Panel */}
      <div className="w-80 border-r border-gray-800 p-6">
        <div className="mb-8">
          <motion.button
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>←</span>
            <span>Back to Dashboard</span>
          </motion.button>
          
          <h2 className="text-xl font-bold mb-6">Settings</h2>
        </div>

        <div className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">PROJECT NAME*</label>
            <input
              type="text"
              value={projectSettings.name}
              onChange={(e) => setProjectSettings(prev => ({...prev, name: e.target.value}))}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project name"
            />
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">ASPECT RATIO</label>
            <div className="flex space-x-2">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio.id}
                  onClick={() => setProjectSettings(prev => ({...prev, aspectRatio: ratio.id}))}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    projectSettings.aspectRatio === ratio.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>

          {/* Video Style */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              VIDEO STYLE 
              <span className="ml-2 text-blue-400 cursor-pointer">View All →</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {videoStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setProjectSettings(prev => ({...prev, videoStyle: style.name}))}
                  className={`relative aspect-video rounded-lg overflow-hidden transition-all ${
                    projectSettings.videoStyle === style.name
                      ? 'ring-2 ring-blue-500'
                      : 'hover:ring-1 hover:ring-gray-600'
                  }`}
                >
                  {style.preview ? (
                    <img src={style.preview} alt={style.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">None</span>
                    </div>
                  )}
                  <div className="absolute bottom-1 left-1 text-xs text-white bg-black/50 px-1 rounded">
                    {style.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Style Reference */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              STYLE REFERENCE <span className="text-gray-500">ⓘ</span>
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <input {...getInputProps()} />
              {projectSettings.styleReference ? (
                <div className="space-y-2">
                  <img
                    src={projectSettings.styleReference}
                    alt="Style Reference"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <p className="text-xs text-gray-400">Click to change image</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-2xl">📁</div>
                  <p className="text-sm text-gray-400">Drag image here</p>
                  <p className="text-xs text-gray-500">Or upload a file</p>
                </div>
              )}
            </div>
          </div>

          {/* Cinematic Inspiration */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">CINEMATIC INSPIRATION</label>
            <input
              type="text"
              value={projectSettings.cinematicInspiration}
              onChange={(e) => setProjectSettings(prev => ({...prev, cinematicInspiration: e.target.value}))}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder='E.g. "Retro, gritty, ecstatic, stylish, noir..."'
            />
          </div>
        </div>
      </div>

      {/* Cast Panel */}
      <div className="w-80 border-r border-gray-800 p-6">
        <h2 className="text-xl font-bold mb-6">Cast</h2>
        
        <div className="space-y-4">
          {cast.map((character) => (
            <div key={character.id} className="flex items-center space-x-3 p-3 bg-gray-900 rounded-lg">
              <img
                src={character.avatar}
                alt={character.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <span className="text-sm text-white">{character.name}</span>
            </div>
          ))}
          
          <motion.button
            onClick={addCharacter}
            className="w-full h-24 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-gray-600 hover:text-white transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-2xl mb-1">+</div>
            <span className="text-sm">Add character</span>
          </motion.button>
        </div>
      </div>

      {/* Main Storyboard Area */}
      <div className="flex-1 p-6">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold mb-2">Start Building Your Storyboard</h3>
            <p className="text-gray-400 mb-6">Configure your settings and add characters to begin</p>
            <motion.button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add First Scene
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryboardBuilder;