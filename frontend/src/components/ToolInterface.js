import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import MusicStudio from './MusicStudio';

const ToolInterface = ({ tool, onBack }) => {
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If it's the Music tool, render the dedicated Music Studio
  if (tool.name === 'Music') {
    return <MusicStudio onBack={onBack} />;
  }

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  const handleInputChange = (key, value) => {
    setInputs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFileUpload = (key, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      handleInputChange(key, e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const executeTool = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${backendUrl}/api/tools/execute`, {
        tool_name: tool.name,
        inputs: inputs
      });
      
      setResult(response.data);
    } catch (error) {
      console.error('Error executing tool:', error);
      setError(error.response?.data?.detail || 'Failed to execute tool');
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (key, type) => {
    switch (type) {
      case 'text':
        return (
          <textarea
            key={key}
            value={inputs[key] || ''}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Enter ${key}`}
            rows="4"
          />
        );
      
      case 'integer':
        return (
          <input
            key={key}
            type="number"
            value={inputs[key] || ''}
            onChange={(e) => handleInputChange(key, parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Enter ${key}`}
          />
        );
      
      case 'image':
      case 'video':
      case 'audio':
        return (
          <FileUpload
            key={key}
            onFileUpload={(file) => handleFileUpload(key, file)}
            acceptedTypes={type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : 'audio/*'}
            label={`Upload ${key}`}
          />
        );
      
      default:
        return (
          <input
            key={key}
            type="text"
            value={inputs[key] || ''}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Enter ${key}`}
          />
        );
    }
  };

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <motion.button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>←</span>
          <span>Back to Tools</span>
        </motion.button>
        
        <span className={getCategoryBadgeClass(tool.category)}>
          {tool.category}
        </span>
      </div>

      {/* Tool Header */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="text-6xl">{tool.icon}</div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
            <p className="text-gray-600 mt-2">{tool.description}</p>
          </div>
        </div>

        {/* Input Form */}
        <div className="space-y-6">
          {Object.entries(tool.inputs).map(([key, type]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {key.replace('_', ' ')}
              </label>
              {renderInputField(key, type)}
            </div>
          ))}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Demo Mode Banner */}
        {result && result.is_demo && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-yellow-600 text-sm">
                🚀 <strong>Demo Mode:</strong> This is sample output. Add your Replicate API token to get real AI-generated content.
              </span>
            </div>
          </div>
        )}

        {/* Execute Button */}
        <div className="mt-8">
          <motion.button
            onClick={executeTool}
            disabled={loading}
            className={`btn-primary w-full py-4 text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              `Execute ${tool.name}`
            )}
          </motion.button>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Result</h2>
          
          <div className="bg-gray-50 rounded-lg p-6">
            {typeof result.result === 'string' && result.result.startsWith('data:image') ? (
              <img src={result.result} alt="Generated result" className="max-w-full h-auto rounded-lg" />
            ) : typeof result.result === 'string' && result.result.startsWith('http') ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Generated content URL:</p>
                <a 
                  href={result.result} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all"
                >
                  {result.result}
                </a>
              </div>
            ) : (
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                {JSON.stringify(result.result, null, 2)}
              </pre>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// File Upload Component
const FileUpload = ({ onFileUpload, acceptedTypes, label }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: acceptedTypes,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <input {...getInputProps()} />
      <div className="text-gray-500">
        <div className="text-2xl mb-2">📁</div>
        {isDragActive ? (
          <p>Drop the file here...</p>
        ) : (
          <p>Drag & drop a file here, or click to select</p>
        )}
        <p className="text-xs mt-1">{label}</p>
      </div>
    </div>
  );
};

export default ToolInterface;