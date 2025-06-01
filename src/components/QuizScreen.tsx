import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import confetti from 'canvas-confetti';
import { X } from 'lucide-react';

/**
 * QuizScreen component that displays the vocabulary quiz questions and handles gameplay
 */
const QuizScreen: React.FC = () => {
  const { state, selectAnswer, timeOut, saveHighScore } = useGame();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer logic
  useEffect(() => {
    if (state.timerActive) {
      setTimeLeft(10);
      if (timerRef.current) clearInterval(timerRef.current);
      
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            timeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.timerActive, timeOut]);

  // Handle end of game
  useEffect(() => {
    if (state.gameOver) {
      // Save high score
      saveHighScore();
      
      // Launch confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Navigate to game over screen
      navigate('/game-over');
    }
  }, [state.gameOver, navigate, saveHighScore]);

  // Current player
  const currentPlayer = state.players[state.currentPlayerIndex];

  // Latin transliteration (simplified)
  const getLatinTransliteration = (word: string) => {
    // This is a placeholder - in a real app, you'd implement proper transliteration
    return word.replace(/ⴰ/g, 'a')
      .replace(/ⴱ/g, 'b')
      .replace(/ⴳ/g, 'g')
      .replace(/ⴷ/g, 'd')
      .replace(/ⴻ/g, 'e')
      .replace(/ⴼ/g, 'f')
      .replace(/ⵀ/g, 'h')
      .replace(/ⵃ/g, 'h')
      .replace(/ⵄ/g, 'a')
      .replace(/ⵅ/g, 'kh')
      .replace(/ⵇ/g, 'q')
      .replace(/ⵉ/g, 'i')
      .replace(/ⵊ/g, 'j')
      .replace(/ⵍ/g, 'l')
      .replace(/ⵎ/g, 'm')
      .replace(/ⵏ/g, 'n')
      .replace(/ⵓ/g, 'u')
      .replace(/ⵔ/g, 'r')
      .replace(/ⵕ/g, 'r')
      .replace(/ⵖ/g, 'gh')
      .replace(/ⵙ/g, 's')
      .replace(/ⵚ/g, 's')
      .replace(/ⵛ/g, 'sh')
      .replace(/ⵜ/g, 't')
      .replace(/ⵟ/g, 't')
      .replace(/ⵡ/g, 'w')
      .replace(/ⵢ/g, 'y')
      .replace(/ⵣ/g, 'z')
      .replace(/ⵥ/g, 'z');
  };

  // Handle option clicks with keyboard shortcuts
  const handleOptionClick = (option: string) => {
    if (state.timerActive) {
      selectAnswer(option);
    }
  };

  // Add keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.timerActive && state.options.length > 0) {
        if (e.key === '1' || e.key === '1') {
          handleOptionClick(state.options[0]);
        } else if (e.key === '2') {
          handleOptionClick(state.options[1]);
        } else if (e.key === '3' && state.options.length > 2) {
          handleOptionClick(state.options[2]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [state.timerActive, state.options]);

  // Calculate time left percentage for the progress bar
  const timeLeftPercentage = (timeLeft / 10) * 100;

  // Get feedback message and color
  let feedbackMessage = '';
  let feedbackColor = '';
  
  if (state.showFeedback) {
    if (state.feedbackType === 'correct') {
      feedbackMessage = '✅ Correct! (+3 pts)';
      feedbackColor = 'bg-green-500';
    } else if (state.feedbackType === 'wrong') {
      feedbackMessage = '❌ Wrong!';
      feedbackColor = 'bg-red-500';
    } else if (state.feedbackType === 'timeout') {
      feedbackMessage = '⌛ Time Up!';
      feedbackColor = 'bg-yellow-500';
    }
  }

  return (
    <div className="bg-aurora min-h-screen flex flex-col items-center p-6">
      <div className="w-full max-w-md">
        {/* Close button */}
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => navigate('/lobby')}
            className="bg-white/10 p-2 rounded-full"
          >
            <X size={20} color="white" />
          </button>
        </div>
        
        <div className="glass-card p-6 w-full">
          <h2 className="text-xl font-bold text-white mb-4">Vocabulary Quiz</h2>
          
          {/* Timer bar */}
          <div className="w-full bg-white/10 rounded-full h-2 mb-6">
            <div 
              className="timer-bar"
              style={{ width: `${timeLeftPercentage}%` }}
            ></div>
          </div>
          
          {/* Player's turn indicator */}
          <p className="text-white/80 text-sm mb-4">
            {currentPlayer.name}'s turn
          </p>
          
          {/* Word to translate */}
          {state.currentWord && (
            <div className="mb-8">
              <p className="text-center mb-1 text-white/70 text-sm">
                What is the translation of:
              </p>
              <h3 className="text-4xl font-bold text-center mb-1 tifinagh text-white">
                {state.currentWord.word}
              </h3>
              <p className="text-center text-white/70 text-sm">
                ({getLatinTransliteration(state.currentWord.word)})
              </p>
            </div>
          )}
          
          {/* Multiple choice options */}
          <div className="space-y-4 mb-6">
            {state.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${
                  state.showFeedback && option === state.correctAnswer
                    ? 'bg-green-600'
                    : state.showFeedback && !state.timerActive && option !== state.correctAnswer
                    ? 'bg-red-600/50'
                    : 'bg-surface-light'
                }`}
                onClick={() => handleOptionClick(option)}
                disabled={!state.timerActive}
              >
                <div className="flex items-center">
                  <span className="bg-white/10 w-6 h-6 rounded-full flex items-center justify-center mr-3 text-sm">
                    {index + 1}
                  </span>
                  {option}
                </div>
              </button>
            ))}
          </div>
          
          {/* Feedback banner */}
          {state.showFeedback && (
            <div className={`${feedbackColor} py-3 px-4 rounded-lg text-white font-bold text-center`}>
              {feedbackMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;