import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { TamazightWord, GameState, SupportedLanguage, HighScore } from '../types';
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
  return 'light'; // Default for server-side or non-browser environments
};

// Initial state for the game
const initialPlayers = [
  {
    id: 1,
    name: 'Player 1',
    avatar: DEFAULT_AVATARS[0],
    score: 0,
    language: 'english' as SupportedLanguage,
  },
  {
    id: 2,
    name: 'Player 2',
    avatar: DEFAULT_AVATARS[1],
    score: 0,
    language: 'english' as SupportedLanguage,
  },
];

const initialState: GameState = {
  theme: getInitialTheme(),
  gameMode: '2-player', // Default game mode
  players: initialPlayers,
  currentPlayerIndex: 0,
  currentRound: 0,
  totalRounds: 10, // This will be set from configurableTotalRounds when a game starts
  configurableTotalRounds: 10, // User-configurable setting
  gameActive: false,
  gameOver: false,
  currentWord: null,
  options: [],
  correctAnswer: '',
  timerActive: false,
  selectedLanguage: 'english',
  showFeedback: false,
  feedbackType: null,
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
  | { type: 'SET_GAME_MODE'; payload: '1-player' | '2-player' };

// Game reducer function
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_GAME_MODE':
      return {
        ...state,
        gameMode: action.payload,
        // Reset players array when mode changes to ensure correct setup for START_GAME
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
        // Ensure only one player if mode is 1-player, taking the first one from current state or initial
        currentPlayers = [{ ... (state.players[0] || initialPlayers[0]), score: 0 }];
      } else {
        // Ensure two players if mode is 2-player, taking from current state or initial
        currentPlayers = [
          { ... (state.players[0] || initialPlayers[0]), score: 0 },
          { ... (state.players[1] || initialPlayers[1]), score: 0 }
        ];
      }
      return {
        ...state,
        gameActive: true,
        gameOver: false,
        currentRound: 0,
        currentPlayerIndex: 0,
        totalRounds: state.configurableTotalRounds,
        players: currentPlayers.map(player => ({ ...player, score: 0 })),
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
      // Get a random word from the dataset
      const words = tamazightWords as TamazightWord[];
      const randomIndex = Math.floor(Math.random() * words.length);
      const selectedWord = words[randomIndex];
      
      // Get the current player's selected language
      const currentPlayer = state.players[state.currentPlayerIndex];
      const targetLanguage = currentPlayer.language;
      
      // Generate options (1 correct, 2 incorrect)
      const correctAnswer = selectedWord.translation[targetLanguage];
      
      // Generate two wrong options from other words
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
      };
    }
    
    case 'SELECT_ANSWER': {
      const isCorrect = action.payload === state.correctAnswer;
      
      // Update player score if correct
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
        // In 1-player mode, don't switch player index. Check if game should end.
        const shouldEndGame = state.currentRound >= state.totalRounds;
        return {
          ...state,
          gameOver: shouldEndGame,
          gameActive: !shouldEndGame,
        };
      }
      // 2-player mode logic
      const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
      const shouldEndGame = state.currentRound >= state.totalRounds && nextPlayerIndex === 0; // End if back to P1 after all rounds

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
        players: updatedPlayers
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
        ...initialState, // This will reset gameMode to its default in initialState
        // players will also be reset by initialState.
        // If we want to keep player names/avatars, we need to merge selectively:
        players: initialState.players.map((p, i) => ({
          ...p,
          name: state.players[i]?.name || p.name, // Keep existing name if available
          avatar: state.players[i]?.avatar || p.avatar, // Keep existing avatar
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
  setConfigurableTotalRounds: (rounds: number) => void; // New dispatcher
  resetGame: () => void;
  saveHighScore: () => void;
  getHighScores: () => HighScore[];
  toggleTheme: () => void;
  setGameMode: (mode: '1-player' | '2-player') => void;
}

// Create the context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Effect to apply theme class to HTML element and ensure localStorage is in sync
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Ensure localStorage is updated if the state was initialized by prefers-color-scheme
    // and not from localStorage itself.
    if (localStorage.getItem('theme') !== state.theme) {
      localStorage.setItem('theme', state.theme);
    }
  }, [state.theme]);

  // Load configurable total rounds from localStorage on initial load
  useEffect(() => {
    const storedRounds = localStorage.getItem('configurableTotalRounds');
    if (storedRounds) {
      const rounds = parseInt(storedRounds, 10);
      if (!isNaN(rounds) && rounds > 0) {
        dispatch({ type: 'SET_CONFIGURABLE_TOTAL_ROUNDS', payload: rounds });
      }
    }
  }, []);

  // Start a new game
  const startGame = () => {
    dispatch({ type: 'START_GAME' });
    nextQuestion();
  };

  // End the current game
  const endGame = () => {
    dispatch({ type: 'END_GAME' });
  };

  // Go to the next question
  const nextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  // Handle answer selection
  const selectAnswer = (answer: string) => {
    dispatch({ type: 'SELECT_ANSWER', payload: answer });
    
    // Hide feedback after a delay then switch player
    setTimeout(() => {
      dispatch({ type: 'HIDE_FEEDBACK' });
      switchPlayer();
    }, 1500);
  };

  // Switch to the next player
  const switchPlayer = () => {
    dispatch({ type: 'SWITCH_PLAYER' });
    
    // If game is still active, go to next question
    if (!state.gameOver) {
      setTimeout(() => {
        nextQuestion();
      }, 500);
    }
  };

  // Handle timeout (when timer expires)
  const timeOut = () => {
    dispatch({ type: 'TIMER_TIMEOUT' });
    playSound('wrong');
    
    // Hide feedback after a delay then switch player
    setTimeout(() => {
      dispatch({ type: 'HIDE_FEEDBACK' });
      switchPlayer();
    }, 1500);
  };

  // Set player name
  const setPlayerName = (playerId: number, name: string) => {
    dispatch({ type: 'SET_PLAYER_NAME', payload: { playerId, name } });
  };

  // Set player language
  const setPlayerLanguage = (playerId: number, language: SupportedLanguage) => {
    dispatch({ type: 'SET_PLAYER_LANGUAGE', payload: { playerId, language } });
  };

  // Set configurable total rounds
  const setConfigurableTotalRounds = (rounds: number) => {
    dispatch({ type: 'SET_CONFIGURABLE_TOTAL_ROUNDS', payload: rounds });
    localStorage.setItem('configurableTotalRounds', rounds.toString()); // Persist to localStorage
  };

  const setGameMode = (mode: '1-player' | '2-player') => {
    dispatch({ type: 'SET_GAME_MODE', payload: mode });
  };

  // Reset the game to initial state
  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  // Save high score to localStorage
  const saveHighScore = () => {
    const { players, gameMode } = state;
    let scoreToSave: HighScore;

    if (gameMode === '1-player' && players.length > 0) {
      const player = players[0];
      scoreToSave = {
        id: Date.now().toString(),
        names: player.name,
        combinedScore: player.score, // For 1-player, it's just their score
        date: new Date().toISOString().split('T')[0]
      };
    } else { // 2-player mode or fallback
      const combinedScore = players.reduce((total, player) => total + player.score, 0);
      const playerNames = players.map(player => player.name).join(' & ');
      scoreToSave = {
        id: Date.now().toString(),
        names: playerNames,
        combinedScore,
        date: new Date().toISOString().split('T')[0]
      };
    }
        
    // Get existing scores
    const existingScores = getHighScores();
    
    // Add new score and sort
    const updatedScores = [...existingScores, scoreToSave]
      .sort((a, b) => b.combinedScore - a.combinedScore)
      .slice(0, 5); // Keep only top 5
    
    // Save to localStorage
    localStorage.setItem('tamazightHighScores', JSON.stringify(updatedScores));
  };

  // Get high scores from localStorage
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

  // Context value
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
    };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// Custom hook to use the game context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  
  return context;
};
