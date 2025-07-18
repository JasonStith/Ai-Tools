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
    <div className="App min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header currentView={currentView} onViewChange={handleViewChange} />
      
      <main className="pt-16">
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