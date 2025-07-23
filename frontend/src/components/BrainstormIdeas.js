import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const BrainstormIdeas = ({ onBack }) => {
  const [currentView, setCurrentView] = useState('boards'); // 'boards' or 'canvas'
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [boards, setBoards] = useState([]);
  const [canvasItems, setCanvasItems] = useState([]);
  const [selectedTool, setSelectedTool] = useState('note');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [loading, setLoading] = useState(false);

  const canvasRef = useRef(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  // Mock boards data similar to Milanote
  useEffect(() => {
    const mockBoards = [
      {
        id: 1,
        name: 'Film Project Ideas',
        description: '2 boards, 3 cards',
        color: 'from-blue-500 to-purple-600',
        icon: '🎬',
        items: 12
      },
      {
        id: 2,
        name: 'Character Development',
        description: '19 boards',
        color: 'from-green-500 to-teal-600',
        icon: '👤',
        items: 8
      },
      {
        id: 3,
        name: 'Story Concepts',
        description: '1 card',
        color: 'from-orange-500 to-red-500',
        icon: '📚',
        items: 5
      }
    ];
    setBoards(mockBoards);
  }, []);

  const departments = [
    { name: 'Script Department', icon: '📝', boards: 3, cards: 9, files: 2, color: 'bg-orange-500' },
    { name: 'Character Design', icon: '👤', boards: 2, cards: 0, files: 0, color: 'bg-yellow-500' },
    { name: 'Visual Style', icon: '🎨', boards: 3, cards: 1, files: 0, color: 'bg-green-500' },
    { name: 'References', icon: '📸', boards: 1, cards: 39, files: 0, color: 'bg-red-500' },
    { name: 'Audio Ideas', icon: '🎵', boards: 0, cards: 3, files: 0, color: 'bg-blue-500' },
    { name: 'Animation', icon: '🎬', boards: 0, cards: 0, files: 0, color: 'bg-purple-500' },
    { name: 'Distribution', icon: '🌐', boards: 0, cards: 0, files: 0, color: 'bg-indigo-500' }
  ];

  const tools = [
    { id: 'note', name: 'Note', icon: '📝', color: 'bg-yellow-400' },
    { id: 'image', name: 'Image', icon: '🖼️', color: 'bg-blue-400' },
    { id: 'text', name: 'Text', icon: '📄', color: 'bg-green-400' },
    { id: 'link', name: 'Link', icon: '🔗', color: 'bg-purple-400' },
    { id: 'video', name: 'Video', icon: '🎥', color: 'bg-red-400' }
  ];

  const inspirationMoods = [
    { name: 'Epic & Cinematic', description: 'Grand, sweeping narratives with visual spectacle' },
    { name: 'Intimate & Personal', description: 'Character-driven stories with emotional depth' },
    { name: 'Dark & Mysterious', description: 'Noir-inspired themes with suspenseful atmosphere' },
    { name: 'Bright & Optimistic', description: 'Uplifting stories with hopeful messages' },
    { name: 'Experimental & Artistic', description: 'Avant-garde approaches to storytelling' },
    { name: 'Action-Packed', description: 'High-energy sequences with dynamic movement' }
  ];

  const generateIdeas = async (mood = 'general') => {
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/tools/execute`, {
        tool_name: 'Brainstorm Ideas',
        inputs: {
          prompt: `Generate creative film ideas with a ${mood} style`,
          genre: mood
        }
      });

      // Add generated ideas as notes to canvas
      const ideas = response.data.result.result || response.data.result;
      const newNote = {
        id: Date.now(),
        type: 'note',
        content: ideas,
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
        width: 320,
        height: 240,
        color: 'bg-yellow-200'
      };

      setCanvasItems(prev => [...prev, newNote]);
      
      // If we're in boards view, switch to canvas to show the result
      if (currentView === 'boards') {
        setSelectedBoard({ id: 'generated', name: `${mood.charAt(0).toUpperCase() + mood.slice(1)} Ideas` });
        setCurrentView('canvas');
      }
    } catch (error) {
      console.error('Error generating ideas:', error);
      // Add error note instead
      const errorNote = {
        id: Date.now(),
        type: 'note',
        content: 'Sorry, there was an error generating ideas. Please try again or add your own ideas manually.',
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
        width: 280,
        height: 120,
        color: 'bg-red-200'
      };
      setCanvasItems(prev => [...prev, errorNote]);
    } finally {
      setLoading(false);
    }
  };

  const addCanvasItem = (e) => {
    if (!isAddingItem) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newItem = {
      id: Date.now(),
      type: selectedTool,
      x: x - 50,
      y: y - 25,
      width: selectedTool === 'note' ? 200 : selectedTool === 'text' ? 250 : 150,
      height: selectedTool === 'note' ? 120 : selectedTool === 'text' ? 80 : 100,
      content: selectedTool === 'note' ? 'New idea...' : selectedTool === 'text' ? 'Add text here...' : '',
      color: selectedTool === 'note' ? 'bg-yellow-200' : selectedTool === 'text' ? 'bg-white' : 'bg-blue-100'
    };

    setCanvasItems(prev => [...prev, newItem]);
    setIsAddingItem(false);
  };

  if (currentView === 'boards') {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <div className="border-b border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={onBack}
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Back to Tools
              </motion.button>
              <div className="text-xl font-bold">Brainstorm Studio</div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors">
                Share
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-80 bg-gray-800 border-r border-gray-700 p-6">
            {/* Navigation */}
            <nav className="space-y-2 mb-8">
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-700 text-white">
                <span>🏠</span>
                <span>Home</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer">
                <span>🔗</span>
                <span>Link</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer">
                <span>📋</span>
                <span>Board</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer">
                <span>📝</span>
                <span>Note</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer">
                <span>🖼️</span>
                <span>Add Image</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer">
                <span>📤</span>
                <span>Upload</span>
              </div>
            </nav>

            {/* Film Project Boards */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4">Film Project Ideas</h3>
              <div className="text-sm text-gray-400 mb-4">2 boards, 3 cards</div>
              
              <div className="space-y-4">
                {boards.map((board) => (
                  <motion.div
                    key={board.id}
                    className={`p-4 rounded-lg bg-gradient-to-r ${board.color} cursor-pointer`}
                    onClick={() => {
                      setSelectedBoard(board);
                      setCurrentView('canvas');
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{board.icon}</span>
                      <div>
                        <h4 className="font-semibold text-white">{board.name}</h4>
                        <p className="text-white/80 text-sm">{board.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Global Library */}
            <div>
              <h3 className="text-lg font-bold mb-4">Global Library</h3>
              <div className="text-sm text-gray-400 mb-4">13 boards</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            {/* Departments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Departments</h2>
                <div className="space-y-4">
                  {departments.map((dept, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => generateIdeas(dept.name.toLowerCase())}
                    >
                      <div className={`w-12 h-12 ${dept.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                        {dept.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{dept.name}</h3>
                        <p className="text-sm text-gray-400">
                          {dept.boards > 0 && `${dept.boards} boards, `}
                          {dept.cards} cards{dept.files > 0 && `, ${dept.files} files`}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Creative Inspiration Panel */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Creative Inspiration</h2>
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Mood & Tone Generator</h3>
                  <div className="space-y-3">
                    {inspirationMoods.map((mood, index) => (
                      <motion.button
                        key={index}
                        onClick={() => generateIdeas(mood.name)}
                        className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="font-medium text-white">{mood.name}</div>
                        <div className="text-sm text-gray-400">{mood.description}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="flex space-x-4">
                <motion.button
                  onClick={() => generateIdeas('general')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✨ Generate Ideas
                </motion.button>
                <motion.button
                  onClick={() => {
                    setSelectedBoard({ id: 'new', name: 'New Brainstorm Board' });
                    setCurrentView('canvas');
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📋 New Board
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Canvas View - Enhanced with better state management and debugging
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Canvas Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => {
                setCurrentView('boards');
                setSelectedBoard(null);
              }}
              className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>←</span>
              <span>Back to Boards</span>
            </motion.button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-xl font-bold text-gray-900">
              {selectedBoard?.name || 'Brainstorm Canvas'}
            </h1>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Canvas Mode
            </span>
          </div>

          {/* Canvas Tools */}
          <div className="flex items-center space-x-2">
            {tools.map((tool) => (
              <motion.button
                key={tool.id}
                onClick={() => {
                  setSelectedTool(tool.id);
                  setIsAddingItem(true);
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors shadow-sm ${
                  selectedTool === tool.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{tool.icon}</span>
                <span className="text-sm font-medium">{tool.name}</span>
              </motion.button>
            ))}
            
            {/* Additional Actions */}
            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            <motion.button
              onClick={() => generateIdeas('cinematic')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✨ AI Ideas
            </motion.button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={canvasRef}
        className={`relative w-full bg-gray-50 overflow-hidden ${isAddingItem ? 'cursor-crosshair' : 'cursor-default'}`}
        onClick={addCanvasItem}
        style={{ height: 'calc(100vh - 120px)' }}
      >
        {/* Enhanced Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Canvas Items */}
        {canvasItems.map((item) => (
          <DraggableItem key={item.id} item={item} setCanvasItems={setCanvasItems} />
        ))}

        {/* Enhanced Instructions */}
        {canvasItems.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="text-8xl mb-6">🎬</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-3">Welcome to Your Creative Canvas</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Start your brainstorming journey! Select a tool above and click anywhere to add ideas, 
                or let AI spark your creativity with generated concepts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={() => generateIdeas('cinematic')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✨ Generate AI Ideas
                </motion.button>
                <motion.button
                  onClick={() => {
                    setSelectedTool('note');
                    setIsAddingItem(true);
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-lg font-medium shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📝 Add First Note
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-700 font-medium">Generating creative ideas...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Status Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span className="font-medium">
              {isAddingItem ? (
                <span className="text-blue-600">🎯 Click anywhere to add {selectedTool}</span>
              ) : (
                <span>{canvasItems.length} items on canvas</span>
              )}
            </span>
            {canvasItems.length > 0 && (
              <button 
                onClick={() => setCanvasItems([])}
                className="text-red-600 hover:text-red-700 text-xs"
              >
                Clear Canvas
              </button>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span>View: Canvas</span>
            <span>|</span>
            <span>Tools: {tools.length}</span>
            <span>|</span>
            <span className="text-green-600">● Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Draggable Canvas Item Component
const DraggableItem = ({ item, setCanvasItems }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(item.content);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = (event, info) => {
    const newX = item.x + info.offset.x;
    const newY = item.y + info.offset.y;
    
    setCanvasItems(prev => prev.map(i => 
      i.id === item.id ? { ...i, x: Math.max(0, newX), y: Math.max(0, newY) } : i
    ));
  };

  const updateContent = () => {
    if (content.trim()) {
      setCanvasItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, content: content.trim() } : i
      ));
    }
    setIsEditing(false);
  };

  const deleteItem = () => {
    setCanvasItems(prev => prev.filter(i => i.id !== item.id));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      updateContent();
    } else if (e.key === 'Escape') {
      setContent(item.content);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={{ left: 0, top: 0, right: 1000, bottom: 800 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(event, info) => {
        setIsDragging(false);
        updatePosition(event, info);
      }}
      className={`absolute ${item.color} rounded-lg shadow-lg border-2 ${
        isDragging ? 'border-blue-400 shadow-xl' : 'border-gray-300'
      } cursor-move group transition-all duration-200`}
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height
      }}
      whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
      whileDrag={{ scale: 1.05, zIndex: 1000, rotate: 2 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Enhanced Control Buttons */}
      <div className="absolute -top-3 -right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={deleteItem}
          className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm shadow-md transition-colors"
          title="Delete item"
        >
          ×
        </button>
        <button
          onClick={() => setIsEditing(true)}
          className="w-7 h-7 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center text-xs shadow-md transition-colors"
          title="Edit content"
        >
          ✏️
        </button>
      </div>

      <div className="p-4 h-full">
        {item.type === 'note' && (
          <div className="h-full">
            {isEditing ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={updateContent}
                onKeyDown={handleKeyDown}
                className="w-full h-full resize-none border-none outline-none bg-transparent text-sm leading-relaxed"
                placeholder="Enter your ideas here..."
                autoFocus
              />
            ) : (
              <div
                onClick={() => setIsEditing(true)}
                className="h-full text-sm text-gray-800 cursor-text overflow-auto leading-relaxed whitespace-pre-wrap"
                title="Click to edit"
              >
                {item.content || 'Click to add content...'}
              </div>
            )}
          </div>
        )}

        {item.type === 'text' && (
          <div className="h-full">
            {isEditing ? (
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={updateContent}
                onKeyDown={handleKeyDown}
                className="w-full h-full border-none outline-none bg-transparent text-sm font-medium"
                placeholder="Enter text..."
                autoFocus
              />
            ) : (
              <div
                onClick={() => setIsEditing(true)}
                className="h-full text-sm font-medium text-gray-800 cursor-text flex items-center"
                title="Click to edit"
              >
                {item.content || 'Click to add text...'}
              </div>
            )}
          </div>
        )}

        {item.type === 'image' && (
          <div className="h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <span className="text-4xl mb-2 block">🖼️</span>
              <span className="text-xs text-gray-600">Image placeholder</span>
            </div>
          </div>
        )}

        {item.type === 'link' && (
          <div className="h-full bg-gradient-to-br from-purple-100 to-purple-200 rounded flex items-center justify-center border-2 border-dashed border-purple-300">
            <div className="text-center">
              <span className="text-4xl mb-2 block">🔗</span>
              <span className="text-xs text-purple-700">Link placeholder</span>
            </div>
          </div>
        )}

        {item.type === 'video' && (
          <div className="h-full bg-gradient-to-br from-red-100 to-red-200 rounded flex items-center justify-center border-2 border-dashed border-red-300">
            <div className="text-center">
              <span className="text-4xl mb-2 block">🎥</span>
              <span className="text-xs text-red-700">Video placeholder</span>
            </div>
          </div>
        )}
      </div>

      {/* Item Type Indicator */}
      <div className="absolute bottom-1 right-1 opacity-30 text-xs">
        {item.type}
      </div>
    </motion.div>
  );
};

export default BrainstormIdeas;