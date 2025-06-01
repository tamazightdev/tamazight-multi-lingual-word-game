import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../context/AudioContext';
import { useGame } from '../context/GameContext'; // Import useGame
import NavBar from './NavBar';
import { Volume2, VolumeX, Music, Hash, Sun, Moon } from 'lucide-react'; // Import Hash, Sun, Moon icons

/**
 * Settings component that allows users to toggle sound, music, and game settings
 */
const Settings: React.FC = () => {
  const { isSoundEnabled, isMusicEnabled, toggleSound, toggleMusic } = useAudio();
  const { state: gameState, setConfigurableTotalRounds, toggleTheme } = useGame(); // Get game state and dispatchers
  const navigate = useNavigate();

  const handleRoundsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const rounds = parseInt(event.target.value, 10);
    setConfigurableTotalRounds(rounds);
  };

  return (
    <div className="bg-aurora min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>

        <div className="glass-card p-6 w-full max-w-md">
          <h3 className="text-xl font-semibold text-white mb-4">Audio Settings</h3>
          
          {/* Sound effects toggle */}
          <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg mb-4">
            <div className="flex items-center">
              {isSoundEnabled ? (
                <Volume2 size={24} className="text-white mr-4" />
              ) : (
                <VolumeX size={24} className="text-white mr-4" />
              )}
              <div>
                <p className="text-white font-medium">Sound Effects</p>
                <p className="text-white/70 text-sm">
                  {isSoundEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${
                isSoundEnabled ? 'bg-green-500 justify-end' : 'bg-gray-700 justify-start'
              }`}
            >
              <span className="w-5 h-5 bg-white rounded-full mx-0.5"></span>
            </button>
          </div>
          
          {/* Background music toggle */}
          <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg mb-6">
            <div className="flex items-center">
              <Music size={24} className="text-white mr-4" />
              <div>
                <p className="text-white font-medium">Background Music</p>
                <p className="text-white/70 text-sm">
                  {isMusicEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleMusic}
              className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${
                isMusicEnabled ? 'bg-green-500 justify-end' : 'bg-gray-700 justify-start'
              }`}
            >
              <span className="w-5 h-5 bg-white rounded-full mx-0.5"></span>
            </button>
          </div>

          {/* Theme Toggle */}
          <h3 className="text-xl font-semibold text-white mt-6 mb-4">Appearance</h3>
          <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg mb-6">
            <div className="flex items-center">
              {gameState.theme === 'dark' ? (
                <Moon size={24} className="text-white mr-4" />
              ) : (
                <Sun size={24} className="text-white mr-4" />
              )}
              <div>
                <p className="text-white font-medium">Theme</p>
                <p className="text-white/70 text-sm">
                  {gameState.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 ${
                gameState.theme === 'dark' ? 'bg-primary-500 justify-end' : 'bg-gray-700 justify-start'
              }`}
            >
              <span className="w-5 h-5 bg-white rounded-full mx-0.5"></span>
            </button>
          </div>
          
          {/* Game Settings Section */}
          <h3 className="text-xl font-semibold text-white mt-6 mb-4">Game Settings</h3>

          {/* Number of Questions setting */}
          <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg mb-6">
            <div className="flex items-center">
              <Hash size={24} className="text-white mr-4" />
              <div>
                <p className="text-white font-medium">Number of Questions</p>
                <p className="text-white/70 text-sm">
                  Set how many questions per game.
                </p>
              </div>
            </div>
            <select
              value={gameState.configurableTotalRounds}
              onChange={handleRoundsChange}
              className="bg-white/10 text-white p-2 rounded-md border border-white/20 focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              <option value="5">5 Questions</option>
              <option value="10">10 Questions</option>
              <option value="15">15 Questions</option>
              <option value="20">20 Questions</option>
            </select>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-4">About</h3>
          
          <div className="p-4 bg-surface-light rounded-lg mb-4">
            <p className="text-white mb-2">
              <span className="font-semibold">Version:</span> 1.1.1 (MVP)
            </p>
            <p className="text-white mb-2">
              <span className="font-semibold">Created by:</span> Gregory Kennedy
            </p>
            <p className="text-white/70 text-sm">
              Learn Tamazight vocabulary in a fun way with translations in multiple languages.
            </p>
          </div>
          
          {/* Return button */}
          <button
            onClick={() => navigate('/lobby')}
            className="btn-secondary w-full"
          >
            Return to Home
          </button>
        </div>
      </div>

      {/* Navigation bar */}
      <NavBar />
    </div>
  );
};

export default Settings;
