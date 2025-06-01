// Map of sound names to their file paths
const SOUND_FILES = {
  correct: '/correct.mp3',
  wrong: '/wrong.mp3',
};

type SoundName = keyof typeof SOUND_FILES;

// Function to play a sound effect
export const playSound = (soundName: SoundName): void => {
  try {
    // Check if sound is enabled in localStorage
    const isSoundEnabled = localStorage.getItem('tamazightSoundEnabled');
    if (isSoundEnabled === 'false') return;
    
    const audio = new Audio(SOUND_FILES[soundName]);
    audio.volume = 0.5;
    audio.play().catch(error => {
      console.warn('Could not play sound:', error);
    });
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};
