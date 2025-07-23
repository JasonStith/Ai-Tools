import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const ScriptWriter = ({ onBack }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProject, setCurrentProject] = useState('Untitled Script');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: '1',
        type: 'assistant',
        content: `Hi! I'm your AI script writing assistant. I can help you create screenplays, dialogue, character development, plot outlines, and more.

What kind of script would you like to work on today?`,
        timestamp: new Date()
      }
    ]);
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);

    try {
      const response = await axios.post(`${backendUrl}/api/tools/execute`, {
        tool_name: 'Script Writer',
        inputs: {
          prompt: inputValue,
          system_prompt: 'You are a professional screenwriter and script writing assistant. Help create engaging, well-formatted scripts with proper screenplay format, dialogue, and scene descriptions.'
        }
      });

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.data.result.result || response.data.result,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating script:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error while generating your script. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const clearConversation = () => {
    setMessages([
      {
        id: '1',
        type: 'assistant',
        content: `Hi! I'm your AI script writing assistant. I can help you create screenplays, dialogue, character development, plot outlines, and more.

What kind of script would you like to work on today?`,
        timestamp: new Date()
      }
    ]);
  };

  const formatContent = (content) => {
    // Simple formatting for screenplay content
    return content.split('\n').map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      
      // Character names (all caps lines)
      if (line.trim().match(/^[A-Z][A-Z\s]+$/)) {
        return (
          <div key={index} className="font-bold text-white mt-4 mb-1">
            {line.trim()}
          </div>
        );
      }
      
      // Scene headings (INT./EXT.)
      if (line.trim().match(/^(INT\.|EXT\.|FADE)/)) {
        return (
          <div key={index} className="font-bold text-blue-300 mt-4 mb-2 uppercase">
            {line.trim()}
          </div>
        );
      }
      
      // Parentheticals
      if (line.trim().match(/^\(.+\)$/)) {
        return (
          <div key={index} className="text-gray-400 italic ml-4 mb-1">
            {line.trim()}
          </div>
        );
      }
      
      return (
        <div key={index} className="mb-1">
          {line}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 bg-dark-900/95 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              
              <div className="text-xl font-semibold">{currentProject}</div>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                onClick={clearConversation}
                className="text-gray-400 hover:text-white text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear conversation
              </motion.button>
              
              <motion.button
                className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Export Script
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-3xl ${message.type === 'user' ? 'bg-primary-600' : 'bg-dark-800'} rounded-2xl p-6`}>
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' ? 'bg-primary-700' : 'bg-green-600'
                    }`}>
                      {message.type === 'user' ? '👤' : '🤖'}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-300 mb-2">
                        {message.type === 'user' ? 'You' : 'Script Writer AI'}
                      </div>
                      <div className="text-white whitespace-pre-wrap">
                        {message.type === 'assistant' ? formatContent(message.content) : message.content}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-3xl bg-dark-800 rounded-2xl p-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                      🤖
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-300 mb-2">Script Writer AI</div>
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                        <span className="text-gray-400">Writing your script...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 bg-dark-900/95 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-end space-x-4">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe the script you want to create, ask for dialogue, scene ideas, character development..."
                  className="w-full bg-dark-800 border border-gray-700 rounded-xl px-4 py-3 pr-16 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none min-h-[52px] max-h-32"
                  disabled={isGenerating}
                  rows={1}
                />
                <motion.button
                  type="submit"
                  disabled={!inputValue.trim() || isGenerating}
                  className={`absolute right-3 bottom-3 p-2 rounded-lg transition-all duration-200 ${
                    inputValue.trim() && !isGenerating
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                  whileHover={inputValue.trim() && !isGenerating ? { scale: 1.05 } : {}}
                  whileTap={inputValue.trim() && !isGenerating ? { scale: 0.95 } : {}}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </motion.button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-gray-500">
                Press Enter to send, Shift+Enter for new line
              </div>
              <div className="text-xs text-gray-500">
                {inputValue.length}/2000
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScriptWriter;