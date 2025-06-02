import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/lobby');
  };

  return (
    <div className="bg-aurora min-h-screen flex flex-col items-center justify-between p-6 text-white">
      <div className="flex flex-col items-center w-full max-w-md mt-8">
        {/* Game logo */}
        <img
          src="image-1st-screen-tamazight-multi-lingual-word-game.png"
          alt="Tamazight Multilingual Word Game"
          className="w-full max-w-md mb-8"
        />

        {/* Game title */}
        <h1 className="text-4xl font-bold text-center mb-4">
          Tamazight Multilingual Word Game
        </h1>
        
        {/* Game description */}
        <p className="text-center text-white/90 mb-8 text-lg">
          Learn Tamazight vocabulary in a fun way with translations in multiple languages. 
          Challenge yourself or play with a friend!
        </p>
      </div>
      
      {/* Get started button */}
      <button 
        onClick={handleGetStarted}
        className="btn-primary w-full max-w-xs mb-8 text-xl"
      >
        Get Started
        <ArrowRight size={24} />
      </button>
    </div>
  );
};

export default WelcomeScreen;
