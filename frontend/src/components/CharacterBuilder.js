import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const CharacterBuilder = ({ onBack }) => {
  const [characterPrompt, setCharacterPrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('Realistic');
  const [selectedGender, setSelectedGender] = useState('Any');
  const [selectedAge, setSelectedAge] = useState('Adult');
  const [selectedEmotion, setSelectedEmotion] = useState('Neutral');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCharacter, setGeneratedCharacter] = useState(null);
  const [credits, setCredits] = useState(2295);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  const styles = ['Realistic', 'Cinematic', 'Animated', 'Comic', 'Concept Art'];
  const genders = ['Any', 'Male', 'Female', 'Non-binary'];
  const ages = ['Child', 'Teen', 'Adult', 'Elder'];
  const emotions = ['Neutral', 'Happy', 'Sad', 'Angry', 'Surprised', 'Confident', 'Mysterious'];

  const inspirationPrompts = [
    "A cyberpunk detective with neon-lit eyes and a weathered trench coat",
    "An elegant medieval queen with flowing robes and a crown of starlight",
    "A space explorer in a sleek suit with glowing tech interfaces",
    "A mystical forest guardian with bark-like skin and glowing runes",
    "A steampunk inventor with brass goggles and mechanical arm prosthetics",
    "A noir film detective in shadows with cigarette smoke curling around them"
  ];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          setReferenceImage(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    },
    maxFiles: 1
  });

  const inspireMe = () => {
    const randomPrompt = inspirationPrompts[Math.floor(Math.random() * inspirationPrompts.length)];
    setCharacterPrompt(randomPrompt);
  };

  const generateCharacter = async () => {
    if (!characterPrompt.trim()) return;

    try {
      setIsGenerating(true);

      const response = await axios.post(`${backendUrl}/api/tools/execute`, {
        tool_name: 'Character Builder',
        inputs: {
          prompt: `${characterPrompt}, ${selectedStyle.toLowerCase()} style, ${selectedGender.toLowerCase()} ${selectedAge.toLowerCase()}, ${selectedEmotion.toLowerCase()} expression`,
          style: selectedStyle,
          reference_image: referenceImage
        }
      });

      setGeneratedCharacter({
        image: response.data.result.result || response.data.result,
        prompt: characterPrompt,
        settings: {
          style: selectedStyle,
          gender: selectedGender,
          age: selectedAge,
          emotion: selectedEmotion
        }
      });

      setCredits(prev => Math.max(0, prev - 1));

    } catch (error) {
      console.error('Error generating character:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left Sidebar */}
      <div className="w-16 bg-gray-900 flex flex-col items-center py-4 space-y-4">
        <motion.button
          onClick={onBack}
          className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </motion.button>

        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
            <span className="text-sm">🎭</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
            <span className="text-sm">🖼️</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
            <span className="text-sm">👤</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
            <span className="text-sm">🎬</span>
          </div>
        </div>

        <div className="mt-auto flex flex-col items-center">
          <div className="text-xs text-red-400 font-bold">{credits}</div>
          <div className="text-xs text-gray-500 text-center">credits</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Character Builder</h1>
              <p className="text-gray-400 mt-1">Create compelling characters for your films</p>
            </div>
            <div className="text-sm text-gray-400">
              AI Filmmaker
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex">
          {/* Left Panel - Controls */}
          <div className="w-96 p-6 border-r border-gray-800 space-y-6">
            {/* Character Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Character Settings</h3>
              
              {/* Style Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Style</label>
                <div className="flex flex-wrap gap-2">
                  {styles.map((style) => (
                    <button
                      key={style}
                      onClick={() => setSelectedStyle(style)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedStyle === style
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                <div className="flex flex-wrap gap-2">
                  {genders.map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setSelectedGender(gender)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedGender === gender
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
                <div className="flex flex-wrap gap-2">
                  {ages.map((age) => (
                    <button
                      key={age}
                      onClick={() => setSelectedAge(age)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedAge === age
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              {/* Emotion Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Emotion</label>
                <div className="flex flex-wrap gap-2">
                  {emotions.map((emotion) => (
                    <button
                      key={emotion}
                      onClick={() => setSelectedEmotion(emotion)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedEmotion === emotion
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {emotion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reference Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Reference Image (Optional)</label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <input {...getInputProps()} />
                {referenceImage ? (
                  <div className="space-y-2">
                    <img
                      src={referenceImage}
                      alt="Reference"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <p className="text-xs text-gray-400">Click to change image</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-2xl">📁</div>
                    <p className="text-sm text-gray-400">
                      Drop an image here or click to upload
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Generated Character Preview */}
            {generatedCharacter && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Generated Character</label>
                <div className="bg-gray-900 rounded-lg p-4">
                  <img
                    src={generatedCharacter.image}
                    alt="Generated Character"
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <div className="space-y-1 text-xs text-gray-400">
                    <p><span className="text-white">Style:</span> {generatedCharacter.settings.style}</p>
                    <p><span className="text-white">Gender:</span> {generatedCharacter.settings.gender}</p>
                    <p><span className="text-white">Age:</span> {generatedCharacter.settings.age}</p>
                    <p><span className="text-white">Emotion:</span> {generatedCharacter.settings.emotion}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Center Panel - Main Creation Area */}
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-2xl text-center space-y-8">
              {/* Icon */}
              <div className="w-16 h-16 mx-auto bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>

              {/* Title */}
              <div>
                <h2 className="text-3xl font-bold mb-4">Create a character</h2>
                <p className="text-gray-400 max-w-lg mx-auto">
                  Describe your character below. Add details about appearance, personality, 
                  clothing, and setting to bring them to life.
                </p>
              </div>

              {/* Settings Display */}
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Style:</span>
                  <span className="text-white">{selectedStyle}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Gender:</span>
                  <span className="text-white">{selectedGender}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Age:</span>
                  <span className="text-white">{selectedAge}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Emotion:</span>
                  <span className="text-white">{selectedEmotion}</span>
                </div>
              </div>

              {/* Prompt Input */}
              <div className="relative">
                <textarea
                  value={characterPrompt}
                  onChange={(e) => setCharacterPrompt(e.target.value)}
                  placeholder="Describe your character (appearance, clothing, pose, background)..."
                  className="w-full h-32 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  disabled={isGenerating}
                />
                <motion.button
                  onClick={inspireMe}
                  className="absolute bottom-3 left-3 text-xs text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  💡 Inspire me
                </motion.button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center space-x-4">
                <motion.button
                  onClick={generateCharacter}
                  disabled={!characterPrompt.trim() || isGenerating}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                    characterPrompt.trim() && !isGenerating
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                  whileHover={characterPrompt.trim() && !isGenerating ? { scale: 1.05 } : {}}
                  whileTap={characterPrompt.trim() && !isGenerating ? { scale: 0.95 } : {}}
                >
                  {isGenerating ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    '✨ Create Character'
                  )}
                </motion.button>

                {generatedCharacter && (
                  <motion.button
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    💾 Save Character
                  </motion.button>
                )}
              </div>

              {/* Credits Info */}
              <p className="text-xs text-gray-500">
                Each character generation costs 1 credit. You have {credits} credits remaining.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterBuilder;