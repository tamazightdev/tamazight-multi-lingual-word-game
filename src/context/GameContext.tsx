import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { TamazightWord, GameState, SupportedLanguage, HighScore, Player } from '../types';
import tamazightWords from '../data/tamazight.json';
import { playSound } from '../utils/audio';

// Default player avatars
const DEFAULT_AVATARS = [
  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
];

// Function to get initial theme
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (storedTheme) {
      return storedTheme;
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
  return 'light';
};

// Initial state for the game
const initialPlayers: Player[] = [
  {
    id: 1,
    name: 'Player 1',
    avatar: DEFAULT_AVATARS[0],
    score: 0,
    language: 'english',
    streak: 0,
    xp: 0,
    level: 1,
    powerUps: {
      fiftyFifty: true,
      freezeTime: true,
      hint: true
    },
    dailyStreak: 0,
    lastPlayedDate: new Date().toISOString().split('T')[0]
  },
  {
    id: 2,
    name: 'Player 2',
    avatar: DEFAULT_AVATARS[1],
    score: 0,
    language: 'english',
    streak: 0,
    xp: 0,
    level: 1,
    powerUps: {
      fiftyFifty: true,
      freezeTime: true,
      hint: true
    },
    dailyStreak: 0,
    lastPlayedDate: new Date().toISOString().split('T')[0]
  }
];

const initialState: GameState = {
  theme: getInitialTheme(),
  gameMode: '2-player',
  players: initialPlayers,
  currentPlayerIndex: 0,
  currentRound: 0,
  totalRounds: 10,
  configurableTotalRounds: 10,
  gameActive: false,
  gameOver: false,
  currentWord: null,
  options: [],
  correctAnswer: '',
  timerActive: false,
  selectedLanguage: 'english',
  showFeedback: false,
  feedbackType: null,
  badges: [],
  isTimerFrozen: false,
  removedOption: null
};

// Define action types
type GameAction =
  | { type: 'START_GAME' }
  | { type: 'END_GAME' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'SELECT_ANSWER'; payload: string }
  | { type: 'SWITCH_PLAYER' }
  | { type: 'TIMER_TIMEOUT' }
  | { type: 'SET_PLAYER_NAME'; payload: { playerId: number; name: string } }
  | { type: 'SET_PLAYER_LANGUAGE'; payload: { playerId: number; language: SupportedLanguage } }
  | { type: 'HIDE_FEEDBACK' }
  | { type: 'RESET_GAME' }
  | { type: 'SET_CONFIGURABLE_TOTAL_ROUNDS'; payload: number }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_GAME_MODE'; payload: '1-player' | '2-player' }
  | { type: 'USE_POWER_UP'; payload: { playerId: number; powerUpType: keyof Player['powerUps'] } }
  | { type: 'SET_TIMER_FROZEN'; payload: boolean }
  | { type: 'SET_REMOVED_OPTION'; payload: string | null };

// Game reducer function
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'USE_POWER_UP': {
      const { playerId, powerUpType } = action.payload;
      return {
        ...state,
        players: state.players.map(player =>
          player.id === playerId
            ? {
                ...player,
                powerUps: {
                  ...player.powerUps,
                  [powerUpType]: false
                }
              }
            : player
        )
      };
    }

    case 'SET_TIMER_FROZEN':
      return {
        ...state,
        isTimerFrozen: action.payload
      };

    case 'SET_REMOVED_OPTION':
      return {
        ...state,
        removedOption: action.payload
      };

    case 'SET_GAME_MODE':
      return {
        ...state,
        gameMode: action.payload,
        players: action.payload === '1-player' 
          ? [initialPlayers[0]] 
          : initialPlayers,
        currentPlayerIndex: 0,
      };

    case 'TOGGLE_THEME': {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return { ...state, theme: newTheme };
    }

    case 'START_GAME': {
      let currentPlayers = state.players;
      if (state.gameMode === '1-player') {
        currentPlayers = [{ ...state.players[0], score: 0 }];
      } else {
        currentPlayers = state.players.map(player => ({ ...player, score: 0 }));
      }
      return {
        ...state,
        gameActive: true,
        gameOver: false,
        currentRound: 0,
        currentPlayerIndex: 0,
        totalRounds: state.configurableTotalRounds,
        players: currentPlayers,
        showFeedback: false,
        feedbackType: null,
      };
    }

    case 'END_GAME':
      return {
        ...state,
        gameActive: false,
        gameOver: true,
        timerActive: false,
      };

    case 'NEXT_QUESTION': {
      const words = tamazightWords as TamazightWord[];
      const randomIndex = Math.floor(Math.random() * words.length);
      const selectedWord = words[randomIndex];
      
      // Get the current player's selected language
      const currentPlayer = state.players[state.currentPlayerIndex];
      const targetLanguage = currentPlayer.language;
      
      // Get the correct answer in the target language
      const correctAnswer = selectedWord.translation[targetLanguage];
      
      // Generate wrong options from other words in the same language
      let wrongOptions: string[] = [];
      while (wrongOptions.length < 2) {
        const randomWordIndex = Math.floor(Math.random() * words.length);
        if (randomWordIndex !== randomIndex) {
          const wrongOption = words[randomWordIndex].translation[targetLanguage];
          if (!wrongOptions.includes(wrongOption) && wrongOption !== correctAnswer) {
            wrongOptions.push(wrongOption);
          }
        }
      }
      
      // Combine and shuffle options
      const allOptions = [correctAnswer, ...wrongOptions];
      const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
      
      return {
        ...state,
        currentWord: selectedWord,
        options: shuffledOptions,
        correctAnswer,
        timerActive: true,
        currentRound: state.currentRound + 1,
        showFeedback: false,
        feedbackType: null,
        removedOption: null,
        isTimerFrozen: false,
      };
    }

    case 'SELECT_ANSWER': {
      const isCorrect = action.payload === state.correctAnswer;
      const updatedPlayers = [...state.players];
      if (isCorrect) {
        updatedPlayers[state.currentPlayerIndex] = {
          ...updatedPlayers[state.currentPlayerIndex],
          score: updatedPlayers[state.currentPlayerIndex].score + 3
        };
        playSound('correct');
      } else {
        playSound('wrong');
      }
      
      return {
        ...state,
        players: updatedPlayers,
        timerActive: false,
        showFeedback: true,
        feedbackType: isCorrect ? 'correct' : 'wrong',
      };
    }

    case 'SWITCH_PLAYER': {
      if (state.gameMode === '1-player') {
        const shouldEndGame = state.currentRound >= state.totalRounds;
        return {
          ...state,
          gameOver: shouldEndGame,
          gameActive: !shouldEndGame,
        };
      }
      const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
      const shouldEndGame = state.currentRound >= state.totalRounds && nextPlayerIndex === 0;

      return {
        ...state,
        currentPlayerIndex: nextPlayerIndex,
        gameOver: shouldEndGame,
        gameActive: !shouldEndGame,
      };
    }

    case 'TIMER_TIMEOUT':
      return {
        ...state,
        timerActive: false,
        showFeedback: true,
        feedbackType: 'timeout',
      };

    case 'SET_PLAYER_NAME': {
      const { playerId, name } = action.payload;
      const updatedPlayers = state.players.map(player => 
        player.id === playerId ? { ...player, name } : player
      );
      
      return {
        ...state,
        players: updatedPlayers
      };
    }

    case 'SET_PLAYER_LANGUAGE': {
      const { playerId, language } = action.payload;
      const updatedPlayers = state.players.map(player => 
        player.id === playerId ? { ...player, language } : player
      );
      
      return {
        ...state,
        players: updatedPlayers,
        selectedLanguage: language // Update the selected language
      };
    }

    case 'HIDE_FEEDBACK':
      return {
        ...state,
        showFeedback: false,
        feedbackType: null,
      };

    case 'RESET_GAME':
      return {
        ...initialState,
        players: state.players.map((p, i) => ({
          ...initialPlayers[i],
          name: p.name,
          avatar: p.avatar,
          language: p.language // Preserve the selected language
        })),
      };

    case 'SET_CONFIGURABLE_TOTAL_ROUNDS':
      return {
        ...state,
        configurableTotalRounds: action.payload,
      };

    default:
      return state;
  }
};

// Define the context interface
interface GameContextType {
  state: GameState;
  startGame: () => void;
  endGame: () => void;
  nextQuestion: () => void;
  selectAnswer: (answer: string) => void;
  switchPlayer: () => void;
  timeOut: () => void;
  setPlayerName: (playerId: number, name: string) => void;
  setPlayerLanguage: (playerId: number, language: SupportedLanguage) => void;
  setConfigurableTotalRounds: (rounds: number) => void;
  resetGame: () => void;
  saveHighScore: () => void;
  getHighScores: () => HighScore[];
  toggleTheme: () => void;
  setGameMode: (mode: '1-player' | '2-player') => void;
  usePowerUp: (playerId: number, powerUpType: keyof Player['powerUps']) => void;
  setTimerFrozen: (frozen: boolean) => void;
  setRemovedOption: (option: string | null) => void;
}

// Create the context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    if (localStorage.getItem('theme') !== state.theme) {
      localStorage.setItem('theme', state.theme);
    }
  }, [state.theme]);

  useEffect(() => {
    const storedRounds = localStorage.getItem('configurableTotalRounds');
    if (storedRounds) {
      const rounds = parseInt(storedRounds, 10);
      if (!isNaN(rounds) && rounds > 0) {
        dispatch({ type: 'SET_CONFIGURABLE_TOTAL_ROUNDS', payload: rounds });
      }
    }
  }, []);

  const startGame = () => {
    dispatch({ type: 'START_GAME' });
    nextQuestion();
  };

  const endGame = () => {
    dispatch({ type: 'END_GAME' });
  };

  const nextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  const selectAnswer = (answer: string) => {
    dispatch({ type: 'SELECT_ANSWER', payload: answer });
    setTimeout(() => {
      dispatch({ type: 'HIDE_FEEDBACK' });
      switchPlayer();
    }, 1500);
  };

  const switchPlayer = () => {
    dispatch({ type: 'SWITCH_PLAYER' });
    if (!state.gameOver) {
      setTimeout(() => {
        nextQuestion();
      }, 500);
    }
  };

  const timeOut = () => {
    dispatch({ type: 'TIMER_TIMEOUT' });
    playSound('wrong');
    setTimeout(() => {
      dispatch({ type: 'HIDE_FEEDBACK' });
      switchPlayer();
    }, 1500);
  };

  const setPlayerName = (playerId: number, name: string) => {
    dispatch({ type: 'SET_PLAYER_NAME', payload: { playerId, name } });
  };

  const setPlayerLanguage = (playerId: number, language: SupportedLanguage) => {
    dispatch({ type: 'SET_PLAYER_LANGUAGE', payload: { playerId, language } });
  };

  const setConfigurableTotalRounds = (rounds: number) => {
    dispatch({ type: 'SET_CONFIGURABLE_TOTAL_ROUNDS', payload: rounds });
    localStorage.setItem('configurableTotalRounds', rounds.toString());
  };

  const setGameMode = (mode: '1-player' | '2-player') => {
    dispatch({ type: 'SET_GAME_MODE', payload: mode });
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const usePowerUp = (playerId: number, powerUpType: keyof Player['powerUps']) => {
    dispatch({ type: 'USE_POWER_UP', payload: { playerId, powerUpType } });
  };

  const setTimerFrozen = (frozen: boolean) => {
    dispatch({ type: 'SET_TIMER_FROZEN', payload: frozen });
  };

  const setRemovedOption = (option: string | null) => {
    dispatch({ type: 'SET_REMOVED_OPTION', payload: option });
  };

  const saveHighScore = () => {
    const { players, gameMode } = state;
    let scoreToSave: HighScore;

    if (gameMode === '1-player' && players.length > 0) {
      const player = players[0];
      scoreToSave = {
        id: Date.now().toString(),
        names: player.name,
        combinedScore: player.score,
        date: new Date().toISOString().split('T')[0],
        xp: player.xp,
        level: player.level
      };
    } else {
      const combinedScore = players.reduce((total, player) => total + player.score, 0);
      const playerNames = players.map(player => player.name).join(' & ');
      scoreToSave = {
        id: Date.now().toString(),
        names: playerNames,
        combinedScore,
        date: new Date().toISOString().split('T')[0],
        xp: players.reduce((total, player) => total + player.xp, 0),
        level: Math.max(...players.map(player => player.level))
      };
    }
        
    const existingScores = getHighScores();
    const updatedScores = [...existingScores, scoreToSave]
      .sort((a, b) => b.combinedScore - a.combinedScore)
      .slice(0, 5);
    
    localStorage.setItem('tamazightHighScores', JSON.stringify(updatedScores));
  };

  const getHighScores = (): HighScore[] => {
    const scoresString = localStorage.getItem('tamazightHighScores');
    if (!scoresString) return [];
    
    try {
      return JSON.parse(scoresString);
    } catch (error) {
      console.error('Error parsing high scores:', error);
      return [];
    }
  };

  const value = {
    state,
    startGame,
    endGame,
    nextQuestion,
    selectAnswer,
    switchPlayer,
    timeOut,
    setPlayerName,
    setPlayerLanguage,
    setConfigurableTotalRounds,
    resetGame,
    saveHighScore,
    getHighScores,
    toggleTheme: () => dispatch({ type: 'TOGGLE_THEME' }),
    setGameMode,
    usePowerUp,
    setTimerFrozen,
    setRemovedOption,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  
  return context;
};