import React from 'react';
import { useGame } from '../context/GameContext';
import { X } from 'lucide-react';

const BadgeGallery: React.FC = () => {
  const { state, toggleBadgeGallery } = useGame();
  const { badges } = state;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card w-full max-w-lg p-6 relative">
        <button
          onClick={toggleBadgeGallery}
          className="absolute top-4 right-4 text-white/80 hover:text-white"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Badge Collection</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-lg ${
                badge.unlocked
                  ? 'bg-[#E9297E]/20 border border-[#E9297E]/40'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              <h3 className="font-semibold text-white mb-1">{badge.title}</h3>
              <p className="text-sm text-white/70 mb-2">{badge.description}</p>
              
              {badge.progress !== undefined && (
                <div className="w-full h-2 bg-white/10 rounded-full">
                  <div
                    className="h-full bg-[#E9297E] rounded-full transition-all duration-500"
                    style={{
                      width: `${(badge.progress / badge.requirement) * 100}%`
                    }}
                  />
                </div>
              )}
              
              <div className="flex items-center mt-2">
                <span className="text-xs text-white/60">
                  {badge.unlocked
                    ? '✨ Unlocked!'
                    : badge.progress !== undefined
                    ? `Progress: ${badge.progress}/${badge.requirement}`
                    : 'Locked'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BadgeGallery;