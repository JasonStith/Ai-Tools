import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ToolsGallery from './components/ToolsGallery';
import ProjectDashboard from './components/ProjectDashboard';
import ToolInterface from './components/ToolInterface';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedTool, setSelectedTool] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Check demo mode on app load
  useEffect(() => {
    const checkDemoMode = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
        const response = await fetch(`${backendUrl}/api/test-replicate`);
        const data = await response.json();
        setIsDemoMode(data.mode === 'demo');
      } catch (error) {
        console.log('Could not check demo mode:', error);
      }
    };
    checkDemoMode();
  }, []);

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    setCurrentView('tool');
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    if (view !== 'tool') {
      setSelectedTool(null);
    }
  };

  const handleProjectSelect = (project) => {
    setCurrentProject(project);
    setCurrentView('project');
  };

  return (
    <div className="App min-h-screen bg-dark-900">
      <Header currentView={currentView} onViewChange={handleViewChange} />
      
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="fixed top-16 left-0 right-0 bg-yellow-500/90 text-white py-2 px-4 text-center text-sm font-medium z-40 backdrop-blur-sm">
          🚀 Demo Mode: Using sample AI responses. Add your Replicate API token for real AI functionality.
        </div>
      )}
      
      <main className={`${isDemoMode ? 'pt-24' : 'pt-16'}`}>
        {currentView === 'home' && (
          <>
            <Hero />
            <ToolsGallery onToolSelect={handleToolSelect} />
          </>
        )}
        
        {currentView === 'projects' && (
          <ProjectDashboard 
            onProjectSelect={handleProjectSelect}
            currentProject={currentProject}
          />
        )}
        
        {currentView === 'tool' && selectedTool && (
          <ToolInterface 
            tool={selectedTool}
            onBack={() => handleViewChange('home')}
          />
        )}
      </main>
    </div>
  );
}

export default App;