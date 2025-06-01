export interface TamazightWord {
  word: string;
  translation: {
    english: string;
    german: string;
    french: string;
    spanish: string;
    italian: string;
    hungarian: string;
    finland: string;
    arabic: string;
  };
}

export type SupportedLanguage = 
  | 'english'
  | 'german' 
  | 'french' 
  | 'spanish' 
  | 'italian' 
  | 'hungarian' 
  | 'finland' 
  | 'arabic';

export interface Player {
  id: number;
  name: string;
  avatar: string;
  score: number;
  language: SupportedLanguage;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  currentRound: number;
  totalRounds: number;
  configurableTotalRounds: number; // Added for user-configurable number of questions
  gameActive: boolean;
  gameOver: boolean;
  currentWord: TamazightWord | null;
  options: string[];
  correctAnswer: string;
  timerActive: boolean;
  selectedLanguage: SupportedLanguage;
  showFeedback: boolean;
  feedbackType: 'correct' | 'wrong' | 'timeout' | null;
  theme: 'light' | 'dark';
  gameMode: '1-player' | '2-player';
}

export interface HighScore {
  id: string;
  names: string;
  combinedScore: number;
  date: string;
}

export interface AppSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
}
