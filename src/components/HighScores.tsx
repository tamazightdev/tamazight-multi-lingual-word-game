import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { X } from 'lucide-react';
import { RotateCcw } from 'lucide-react';

/**
 * HighScores component that displays the top 5 scores
 */
const HighScores: React.FC = () => {
  const { getHighScores, resetGame } = useGame();
  const navigate = useNavigate();
  const highScores = getHighScores();

  const handlePlayAgain = () => {
    resetGame();
    navigate('/lobby');
  };

  return (
    <div className="bg-aurora min-h-screen flex flex-col items-center justify-center p-6">
      <div className="relative w-full max-w-md">
        {/* Close button */}
        <div className="absolute top-0 right-0">
          <button 
            onClick={() => navigate('/')}
            className="bg-white/10 p-2 rounded-full"
          >
            <X size={20} color="white" />
          </button>
        </div>
        
        <div className="glass-card p-6 w-full">
          <h2 className="text-2xl font-bold text-white text-center mb-6">High Scores</h2>
          
          <h3 className="text-xl font-semibold text-white mb-4">Top 5 Scores</h3>
          
          <div className="space-y-4 mb-8">
            {highScores.length > 0 ? (
              highScores.map((score, index) => (
                <div 
                  key={score.id} 
                  className="glass-card p-4 flex items-center"
                >
                  {/* Rank number */}
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold mr-4">
                    {index + 1}
                  </div>
                  
                  {/* Player avatars (placeholder) */}
                  <div className="w-10 h-10 rounded-full bg-primary-400 flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-xs">
                      {score.names.split(' & ').map(name => name[0]).join('')}
                    </span>
                  </div>
                  
                  {/* Score details */}
                  <div className="flex-1">
                    <p className="text-white font-semibold">{score.names}</p>
                    <div className="flex justify-between">
                      <span className="text-white/70 text-sm">Combined score: {score.combinedScore}</span>
                      <span className="text-white/70 text-sm">{score.date}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/70 text-center">No high scores yet. Start playing to set records!</p>
            )}
          </div>
          
          {/* Play again button */}
          <button
            onClick={handlePlayAgain}
            className="btn-primary w-full flex items-center justify-center"
          >
            <RotateCcw size={18} className="mr-2" />
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default HighScores;