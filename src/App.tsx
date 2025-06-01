import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { AudioProvider } from './context/AudioContext';

// Import components
import WelcomeScreen from './components/WelcomeScreen';
import PlayerLobby from './components/PlayerLobby';
import QuizScreen from './components/QuizScreen';
import GameOverScreen from './components/GameOverScreen';
import HighScores from './components/HighScores';
import Settings from './components/Settings';

function App() {
  return (
    <AudioProvider>
      <GameProvider>
        <Router>
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/lobby" element={<PlayerLobby />} />
            <Route path="/play" element={<QuizScreen />} />
            <Route path="/game-over" element={<GameOverScreen />} />
            <Route path="/high-scores" element={<HighScores />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Router>
      </GameProvider>
    </AudioProvider>
  );
}

export default App;
