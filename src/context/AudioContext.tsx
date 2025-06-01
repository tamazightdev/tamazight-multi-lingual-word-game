import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AudioContextType {
  isSoundEnabled: boolean;
  isMusicEnabled: boolean;
  toggleSound: () => void;
  toggleMusic: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or default to true
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('tamazightSoundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [isMusicEnabled, setIsMusicEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('tamazightMusicEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Background music audio element reference
  const [bgmAudio, setBgmAudio] = useState<HTMLAudioElement | null>(null);

  // Initialize background music
  useEffect(() => {
    const audio = new Audio('/bgm.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    setBgmAudio(audio);

    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  // Manage background music playback based on preference
  useEffect(() => {
    if (bgmAudio) {
      if (isMusicEnabled) {
        bgmAudio.play().catch((_error: any) => {
          console.log('Autoplay prevented. User interaction needed to play audio.');
        });
      } else {
        bgmAudio.pause();
      }
    }
  }, [isMusicEnabled, bgmAudio]);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('tamazightSoundEnabled', JSON.stringify(isSoundEnabled));
    localStorage.setItem('tamazightMusicEnabled', JSON.stringify(isMusicEnabled));
  }, [isSoundEnabled, isMusicEnabled]);

  const toggleSound = () => {
    setIsSoundEnabled((prev: boolean) => !prev);
  };

  const toggleMusic = () => {
    setIsMusicEnabled((prev: boolean) => !prev);
  };

  return (
    <AudioContext.Provider
      value={{
        isSoundEnabled,
        isMusicEnabled,
        toggleSound,
        toggleMusic
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  
  return context;
};
