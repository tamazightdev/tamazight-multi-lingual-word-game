import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import confetti from 'canvas-confetti';
import { X } from 'lucide-react';

/**
 * GameOverScreen component that displays the game results and winner
 */
const GameOverScreen: React.FC = () => {
  const { state, resetGame } = useGame();
  const navigate = useNavigate();

  const { gameMode, players } = state;
  const player1 = players[0];
  const player2 = gameMode === '2-player' && players.length > 1 ? players[1] : null;

  let winner = null;
  let isTie = false;

  if (gameMode === '1-player') {
    winner = player1; // In 1-player mode, the player is always the "winner" for display purposes
  } else if (player1 && player2) {
    if (player1.score > player2.score) {
      winner = player1;
    } else if (player2.score > player1.score) {
      winner = player2;
    } else {
      isTie = true;
    }
  }


  // Confetti effect on mount
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const handlePlayAgain = () => {
    resetGame();
    navigate('/lobby');
  };

  const handleReturnToMenu = () => {
    resetGame();
    navigate('/');
  };

  return (
    <div className="bg-aurora min-h-screen flex flex-col items-center justify-center p-6">
      <div className="relative w-full max-w-md">
        {/* Close button */}
        <div className="absolute top-0 right-0">
          <button 
            onClick={handleReturnToMenu}
            className="bg-white/10 p-2 rounded-full"
          >
            <X size={20} color="white" />
          </button>
        </div>
        
        <div className="glass-card p-6 w-full text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Game Over</h2>
          
          {/* Trophy icon */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-12 h-12 text-yellow-800"
              >
                <path d="M8 21h8m-4-4v4m-5.2-4h10.4c1.68 0 2.52 0 3.16-.33a3 3 0 0 0 1.31-1.3c.33-.65.33-1.5.33-3.18 0-1.6 0-2.4-.23-3.06a3 3 0 0 0-1.7-1.71C19.4 7 18.6 7 17 7H7c-1.6 0-2.4 0-3.06.23a3 3 0 0 0-1.71 1.7C2 9.6 2 10.4 2 12c0 1.68 0 2.53.33 3.17a3 3 0 0 0 1.3 1.3c.65.34 1.5.34 3.17.34Z" />
                <path d="M17 7V4.5a1.5 1.5 0 0 0-1.5-1.5h-7A1.5 1.5 0 0 0 7 4.5V7" />
              </svg>
            </div>
          </div>
          
          {/* Winner announcement */}
          {gameMode === '1-player' ? (
            <>
              <h3 className="text-2xl font-bold text-white mb-2 dark:text-gray-100">Game Complete!</h3>
              <p className="text-white/70 mb-6 dark:text-gray-300">
                Your final score is {player1?.score || 0}.
              </p>
            </>
          ) : isTie ? (
            <>
              <h3 className="text-2xl font-bold text-white mb-2 dark:text-gray-100">It's a tie!</h3>
              <p className="text-white/70 mb-6 dark:text-gray-300">
                Both players scored {player1?.score || 0} points.
              </p>
            </>
          ) : winner ? (
            <>
              <h3 className="text-2xl font-bold text-white mb-2 dark:text-gray-100">
                Congratulations, {winner.name}!
              </h3>
              <p className="text-white/70 mb-6 dark:text-gray-300">
                You won the game with a score of {winner.score} points.
              </p>
            </>
          ) : null}
          
          {/* Player avatars and scores */}
          <div className={`flex mb-8 ${gameMode === '1-player' ? 'justify-center' : 'justify-around'}`}>
            {players.slice(0, gameMode === '1-player' ? 1 : 2).map((player) => (
              <div key={player.id} className="flex flex-col items-center">
                <div className="avatar-circle mb-2">
                  <img
                    src={player.avatar}
                    alt={`${player.name}'s avatar`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-white font-semibold dark:text-gray-200">{player.name}</span>
                <span className="text-3xl font-bold text-white dark:text-gray-100">{player.score}</span>
              </div>
            ))}
          </div>
          
          {/* Action buttons */}
          <div className="space-y-4">
            <button
              onClick={handlePlayAgain}
              className="btn-primary w-full"
            >
              Play Again
            </button>
            <button
              onClick={handleReturnToMenu}
              className="btn-secondary w-full"
            >
              Return to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
