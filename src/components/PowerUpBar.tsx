import React from 'react';
import { useGame } from '../context/GameContext';
import { Split, Clock, Lightbulb } from 'lucide-react';
import toast from 'react-hot-toast';

interface PowerUpBarProps {
  playerId: number;
}

const PowerUpBar: React.FC<PowerUpBarProps> = ({ playerId }) => {
  const { state, usePowerUp } = useGame();
  const player = state.players.find(p => p.id === playerId);

  if (!player || player.level < 3) return null;

  const handlePowerUp = (type: '50-50' | 'freeze' | 'hint') => {
    if (!player.powerUps[type === '50-50' ? 'fiftyFifty' : type === 'freeze' ? 'freezeTime' : 'hint']) {
      toast.error('Power-up already used!');
      return;
    }
    usePowerUp(playerId, type);
  };

  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => handlePowerUp('50-50')}
        disabled={!player.powerUps.fiftyFifty}
        className={`p-2 rounded-full ${
          player.powerUps.fiftyFifty
            ? 'bg-[#E9297E]/80 hover:bg-[#E9297E] text-white'
            : 'bg-white/10 text-white/40'
        }`}
        title="Remove one wrong answer"
      >
        <Split size={20} />
      </button>

      <button
        onClick={() => handlePowerUp('freeze')}
        disabled={!player.powerUps.freezeTime}
        className={`p-2 rounded-full ${
          player.powerUps.freezeTime
            ? 'bg-[#E9297E]/80 hover:bg-[#E9297E] text-white'
            : 'bg-white/10 text-white/40'
        }`}
        title="Freeze timer for 5 seconds"
      >
        <Clock size={20} />
      </button>

      <button
        onClick={() => handlePowerUp('hint')}
        disabled={!player.powerUps.hint}
        className={`p-2 rounded-full ${
          player.powerUps.hint
            ? 'bg-[#E9297E]/80 hover:bg-[#E9297E] text-white'
            : 'bg-white/10 text-white/40'
        }`}
        title="Show first letter of correct answer"
      >
        <Lightbulb size={20} />
      </button>
    </div>
  );
};

export default PowerUpBar;