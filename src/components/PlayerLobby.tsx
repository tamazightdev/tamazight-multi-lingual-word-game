import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { SupportedLanguage } from '../types';
import NavBar from './NavBar';

/**
 * Language options for dropdown selectors
 */
const languageOptions: { value: SupportedLanguage; label: string }[] = [
  { value: 'english', label: 'English' },
  { value: 'german', label: 'German' },
  { value: 'french', label: 'French' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'italian', label: 'Italian' },
  { value: 'hungarian', label: 'Hungarian' },
  { value: 'finland', label: 'Finnish' },
  { value: 'arabic', label: 'Arabic' },
];

/**
 * PlayerLobby component that allows setting up player information before starting the game
 */
const PlayerLobby: React.FC = () => {
  const { state, startGame, setPlayerLanguage, setGameMode } = useGame();
  const navigate = useNavigate();

  const handleStartGame = () => {
    startGame();
    navigate('/play');
  };

  const handleLanguageChange = (
    playerId: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const language = event.target.value as SupportedLanguage;
    setPlayerLanguage(playerId, language);
  };

  return (
    <div className="bg-aurora min-h-screen flex flex-col"> {/* Removed dark:bg-gray-900 to let aurora show */}
      <div className="flex-1 flex flex-col items-center p-6">
        <h2 className="text-2xl font-bold text-white mb-6 dark:text-gray-50"> {/* This dark:text-gray-50 might need to be text-white if bg-aurora is always there */}
          {state.gameMode === '1-player' ? '1-Player Mode' : '2-Player Mode'} Setup
        </h2>

        {/* Game Mode Selection */}
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setGameMode('1-player')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all backdrop-blur-sm border
              ${state.gameMode === '1-player' 
                ? 'bg-primary-500/80 text-white border-primary-500/90' // Active: Glassy primary
                : 'bg-white/10 hover:bg-white/20 text-white/80 border-white/10'}`} // Inactive: Glassy secondary
          >
            1 Player
          </button>
          <button
            onClick={() => setGameMode('2-player')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all backdrop-blur-sm border
              ${state.gameMode === '2-player' 
                ? 'bg-primary-500/80 text-white border-primary-500/90' // Active: Glassy primary
                : 'bg-white/10 hover:bg-white/20 text-white/80 border-white/10'}`} // Inactive: Glassy secondary
          >
            2 Players
          </button>
        </div>

        <div className="glass-card p-6 mb-6 w-full max-w-md"> {/* glass-card already has dark mode variant from index.css */}
          <div className={`flex mb-6 ${state.gameMode === '1-player' ? 'justify-center' : 'justify-around'}`}>
            {/* Player avatars */}
            {state.players.slice(0, state.gameMode === '1-player' ? 1 : 2).map((player) => (
              <div key={player.id} className="flex flex-col items-center">
                <div className="avatar-circle mb-2">
                  <img
                    src={player.avatar}
                    alt={`${player.name}'s avatar`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-white font-semibold dark:text-gray-200">{player.name}</span>
              </div>
            ))}
          </div>

          {/* Score displays - might not be relevant in lobby, but kept for consistency or future use */}
          {/* <div className={`flex mb-8 ${state.gameMode === '1-player' ? 'justify-center' : 'justify-around'}`}>
            {state.players.slice(0, state.gameMode === '1-player' ? 1 : 2).map((player) => (
              <div key={player.id} className="score-card">
                <span className="text-3xl font-bold text-white dark:text-gray-100">
                  {player.score}
                </span>
                <span className="text-xs text-white/70 dark:text-gray-400">
                  Player {player.id} Score
                </span>
              </div>
            ))}
          </div> */}

          {/* Player 1 language selection */}
          {state.players[0] && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-2 dark:text-gray-200">{state.players[0].name}</h3>
              <div className="relative">
                <select
                  className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:outline-none appearance-none"
                  value={state.players[0].language}
                  onChange={(e) => handleLanguageChange(state.players[0].id, e)}
                >
                  {languageOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-slate-700 text-gray-50"> {/* Consistent dark options */}
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white"> {/* Adjusted padding for arrow */}
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Player 2 language selection - only if 2-player mode and player 2 exists */}
          {state.gameMode === '2-player' && state.players[1] && (
            <div className="mb-8">
              <h3 className="text-white font-semibold mb-2 dark:text-gray-200">{state.players[1].name}</h3>
              <div className="relative">
                <select
                  className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:outline-none appearance-none"
                  value={state.players[1].language}
                  onChange={(e) => handleLanguageChange(state.players[1].id, e)}
                >
                  {languageOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-slate-700 text-gray-50"> {/* Consistent dark options */}
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white"> {/* Adjusted padding for arrow */}
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleStartGame}
            className="btn-primary w-full"
          >
            Start Game
          </button>
        </div>
      </div>

      {/* Navigation bar */}
      <NavBar />
    </div>
  );
};

export default PlayerLobby;
