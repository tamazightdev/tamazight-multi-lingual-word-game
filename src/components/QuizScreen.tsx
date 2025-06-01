import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import confetti from 'canvas-confetti';
import { X, Flame } from 'lucide-react';
import PowerUpBar from './PowerUpBar';
import toast from 'react-hot-toast';
import { calculateXP, updateStreak, checkBadgeProgress, unlockPowerUps } from '../utils/gamification';

const QuizScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, selectAnswer, timeOut, saveHighScore } = useGame();
  const [timeLeft, setTimeLeft] = useState(10);
  const [freezeTimer, setFreezeTimer] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer logic with freeze support
  useEffect(() => {
    if (state.timerActive && !freezeTimer) {
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
  }, [state.timerActive, timeOut, freezeTimer]);

  // Handle end of game
  useEffect(() => {
    if (state.gameOver) {
      saveHighScore();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      navigate('/game-over');
    }
  }, [state.gameOver, navigate, saveHighScore]);

  // Current player
  const currentPlayer = state.players[state.currentPlayerIndex];

  // Handle power-ups
  const handlePowerUp = (type: '50-50' | 'freeze' | 'hint') => {
    switch (type) {
      case '50-50':
        // Remove one wrong option
        const wrongOptions = state.options.filter(opt => opt !== state.correctAnswer);
        const optionToRemove = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
        setRemovedOption(optionToRemove);
        break;
      case 'freeze':
        setFreezeTimer(true);
        setTimeout(() => setFreezeTimer(false), 5000);
        break;
      case 'hint':
        toast.success(`First letter: ${state.correctAnswer[0]}`);
        break;
    }
  };

  // Latin transliteration
  const getLatinTransliteration = (word: string) => {
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

  // Handle option selection
  const handleOptionClick = (option: string) => {
    if (state.timerActive) {
      selectAnswer(option);
      
      // Update XP and check for level up
      const isCorrect = option === state.correctAnswer;
      const newStreak = updateStreak(currentPlayer, isCorrect);
      const xpGained = calculateXP(isCorrect ? 3 : 0, newStreak);
      
      if (xpGained > 0) {
        const oldLevel = currentPlayer.level;
        const newLevel = Math.floor((currentPlayer.xp + xpGained) / 100);
        
        if (newLevel > oldLevel) {
          toast.success(`Level Up! 🎉 ${currentPlayer.name} reached level ${newLevel}!`);
          unlockPowerUps(currentPlayer);
        }
      }
      
      // Update badges
      state.badges = checkBadgeProgress(currentPlayer, isCorrect ? 1 : 0, timeLeft, state.badges);
    }
  };

  // Calculate time left percentage
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
          {/* Player info and streak */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">{currentPlayer.name}</span>
              {currentPlayer.streak >= 3 && (
                <div className="flex items-center gap-1 text-orange-400">
                  <Flame size={16} />
                  <span>{currentPlayer.streak}</span>
                </div>
              )}
            </div>
            <span className="text-white/80">Score: {currentPlayer.score}</span>
          </div>

          {/* Power-ups */}
          <PowerUpBar playerId={currentPlayer.id} onUsePowerUp={handlePowerUp} />
          
          {/* Timer bar */}
          <div className="w-full bg-white/10 rounded-full h-2 mb-6">
            <div 
              className={`timer-bar transition-all duration-1000 ${freezeTimer ? 'bg-blue-500' : ''}`}
              style={{ width: `${timeLeftPercentage}%` }}
            ></div>
          </div>
          
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
          <div 
            className="space-y-4 mb-6"
            role="radiogroup" 
            aria-label="Translation options"
          >
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
                role="radio"
                aria-checked={state.selectedAnswer === option}
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
            <div 
              className={`${feedbackColor} py-3 px-4 rounded-lg text-white font-bold text-center`}
              role="alert"
              aria-live="polite"
            >
              {feedbackMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;