import React, { useState, useEffect, useRef } from 'react';
import { motion, useDrag } from 'framer-motion';
import axios from 'axios';

const BrainstormIdeas = ({ onBack }) => {
  const [currentView, setCurrentView] = useState('boards'); // 'boards' or 'canvas'
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [boards, setBoards] = useState([]);
  const [canvasItems, setCanvasItems] = useState([]);
  const [selectedTool, setSelectedTool] = useState('note');
  const [isAddingItem, setIsAddingItem] = useState(false);

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
        width: 280,
        height: 200,
        color: 'bg-yellow-200'
      };

      setCanvasItems(prev => [...prev, newNote]);
    } catch (error) {
      console.error('Error generating ideas:', error);
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

  // Canvas View
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Canvas Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => setCurrentView('boards')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back to Boards
            </motion.button>
            <h1 className="text-xl font-bold text-gray-900">
              {selectedBoard?.name || 'Brainstorm Canvas'}
            </h1>
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
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  selectedTool === tool.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{tool.icon}</span>
                <span className="text-sm font-medium">{tool.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={canvasRef}
        className="relative w-full h-screen bg-gray-50 overflow-hidden cursor-crosshair"
        onClick={addCanvasItem}
        style={{ height: 'calc(100vh - 80px)' }}
      >
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Canvas Items */}
        {canvasItems.map((item) => (
          <DraggableItem key={item.id} item={item} setCanvasItems={setCanvasItems} />
        ))}

        {/* Instructions */}
        {canvasItems.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">💡</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Start Brainstorming</h3>
              <p className="text-gray-600 mb-6">
                Select a tool above and click anywhere on the canvas to add ideas
              </p>
              <motion.button
                onClick={() => generateIdeas('cinematic')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Generate First Ideas
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            {isAddingItem ? `Click to add ${selectedTool}` : `${canvasItems.length} items on canvas`}
          </div>
          <div className="flex items-center space-x-4">
            <span>Zoom: 100%</span>
            <span>|</span>
            <span>Canvas: Infinite</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Draggable Canvas Item Component
const DraggableItem = ({ item, setCanvasItems }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(item.content);

  const { x, y } = useDrag({
    from: { x: item.x, y: item.y },
    bounds: { left: 0, top: 0, right: 2000, bottom: 2000 }
  });

  const updatePosition = () => {
    setCanvasItems(prev => prev.map(i => 
      i.id === item.id ? { ...i, x: x.get(), y: y.get() } : i
    ));
  };

  const updateContent = () => {
    setCanvasItems(prev => prev.map(i => 
      i.id === item.id ? { ...i, content } : i
    ));
    setIsEditing(false);
  };

  const deleteItem = () => {
    setCanvasItems(prev => prev.filter(i => i.id !== item.id));
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={updatePosition}
      className={`absolute ${item.color} rounded-lg shadow-md border border-gray-300 cursor-move group`}
      style={{
        x,
        y,
        width: item.width,
        height: item.height
      }}
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.05, zIndex: 1000 }}
    >
      {/* Delete Button */}
      <button
        onClick={deleteItem}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
      >
        ×
      </button>

      <div className="p-3 h-full">
        {item.type === 'note' && (
          <div className="h-full">
            {isEditing ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={updateContent}
                onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && updateContent()}
                className="w-full h-full resize-none border-none outline-none bg-transparent text-sm"
                autoFocus
              />
            ) : (
              <div
                onClick={() => setIsEditing(true)}
                className="h-full text-sm text-gray-800 cursor-text overflow-hidden"
              >
                {item.content}
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
                onKeyDown={(e) => e.key === 'Enter' && updateContent()}
                className="w-full h-full border-none outline-none bg-transparent text-sm font-medium"
                autoFocus
              />
            ) : (
              <div
                onClick={() => setIsEditing(true)}
                className="h-full text-sm font-medium text-gray-800 cursor-text flex items-center"
              >
                {item.content}
              </div>
            )}
          </div>
        )}

        {item.type === 'image' && (
          <div className="h-full bg-gray-200 rounded flex items-center justify-center">
            <span className="text-2xl">🖼️</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BrainstormIdeas;