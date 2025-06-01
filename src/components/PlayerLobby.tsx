import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { SupportedLanguage } from '../types';
import NavBar from './NavBar';
import { Trophy, Flame } from 'lucide-react';

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

const PlayerLobby: React.FC = () => {
  const { 
    state, 
    startGame, 
    setPlayerLanguage, 
    setGameMode,
    toggleBadgeGallery 
  } = useGame();
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
    <div className="bg-aurora min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center p-6">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {state.gameMode === '1-player' ? '1-Player Mode' : '2-Player Mode'} Setup
            </h2>
            <button
              onClick={toggleBadgeGallery}
              className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Trophy size={20} className="text-white" />
              <span className="text-white">Badges</span>
            </button>
          </div>

          {/* Game Mode Selection */}
          <div className="mb-6 flex space-x-4">
            <button
              onClick={() => setGameMode('1-player')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all backdrop-blur-sm border
                ${state.gameMode === '1-player' 
                  ? 'bg-[#E9297E]/80 text-white border-[#E9297E]/90'
                  : 'bg-white/10 hover:bg-white/20 text-white/80 border-white/10'}`}
            >
              1 Player
            </button>
            <button
              onClick={() => setGameMode('2-player')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all backdrop-blur-sm border
                ${state.gameMode === '2-player' 
                  ? 'bg-[#E9297E]/80 text-white border-[#E9297E]/90'
                  : 'bg-white/10 hover:bg-white/20 text-white/80 border-white/10'}`}
            >
              2 Players
            </button>
          </div>

          <div className="glass-card p-6 mb-6">
            {/* Player Setup */}
            <div className={`flex mb-6 ${state.gameMode === '1-player' ? 'justify-center' : 'justify-around'}`}>
              {state.players.slice(0, state.gameMode === '1-player' ? 1 : 2).map((player) => (
                <div key={player.id} className="flex flex-col items-center">
                  <div className="avatar-circle mb-2">
                    <img
                      src={player.avatar}
                      alt={`${player.name}'s avatar`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-white font-semibold">{player.name}</span>
                  
                  {/* XP and Level */}
                  <div className="flex items-center gap-2 mt-1 mb-2">
                    <span className="text-white/80 text-sm">Level {player.level}</span>
                    {player.streak >= 3 && (
                      <div className="flex items-center gap-1 text-orange-400">
                        <Flame size={16} />
                        <span className="text-sm">{player.streak}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* XP Bar */}
                  <div className="w-32 h-2 bg-white/10 rounded-full mb-4">
                    <div 
                      className="h-full bg-[#E9297E] rounded-full transition-all duration-500"
                      style={{ width: `${(player.xp % 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Language Selection */}
            {state.players.slice(0, state.gameMode === '1-player' ? 1 : 2).map((player) => (
              <div key={player.id} className="mb-4">
                <h3 className="text-white font-semibold mb-2">{player.name}</h3>
                <div className="relative">
                  <select
                    className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 backdrop-blur-sm focus:ring-2 focus:ring-[#E9297E] focus:outline-none appearance-none"
                    value={player.language}
                    onChange={(e) => handleLanguageChange(player.id, e)}
                  >
                    {languageOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-slate-700 text-gray-50">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={handleStartGame}
              className="btn-primary w-full"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>

      <NavBar />
    </div>
  );
};

export default PlayerLobby;