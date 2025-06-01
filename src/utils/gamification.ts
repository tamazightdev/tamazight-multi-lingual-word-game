import { Player, Badge } from '../types';
import toast from 'react-hot-toast';

export const calculateXP = (score: number, streak: number): number => {
  let xp = score * 10; // Base XP
  
  // Streak bonuses
  if (streak >= 7) xp += 20;
  else if (streak >= 5) xp += 10;
  
  return xp;
};

export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 100);
};

export const updateStreak = (player: Player, isCorrect: boolean): number => {
  if (!isCorrect) return 0;
  return player.streak + 1;
};

export const checkDailyStreak = (player: Player): void => {
  const today = new Date().toISOString().split('T')[0];
  const lastPlayed = player.lastPlayedDate;
  
  if (!lastPlayed) {
    player.dailyStreak = 1;
  } else {
    const lastDate = new Date(lastPlayed);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
      player.dailyStreak++;
      toast(`${player.dailyStreak}-Day Streak! 🔥`);
    } else if (lastDate.toISOString().split('T')[0] !== today) {
      player.dailyStreak = 1;
    }
  }
  
  player.lastPlayedDate = today;
};

export const BADGES: Badge[] = [
  {
    id: 'word-wizard',
    title: 'Word Wizard',
    description: 'Get 10 correct answers in one language',
    unlocked: false,
    progress: 0,
    requirement: 10
  },
  {
    id: 'speedster',
    title: 'Speedster',
    description: 'Answer correctly with >5s remaining 5 times',
    unlocked: false,
    progress: 0,
    requirement: 5
  },
  {
    id: 'perfect-round',
    title: 'Perfect Round',
    description: 'Complete a game with no mistakes',
    unlocked: false,
    requirement: 1
  },
  {
    id: 'comeback',
    title: 'Comeback King/Queen',
    description: 'Win after trailing by 6+ points',
    unlocked: false,
    requirement: 1
  },
  {
    id: 'polyglot',
    title: 'Polyglot Beginner',
    description: 'Play in 3 different languages',
    unlocked: false,
    progress: 0,
    requirement: 3
  }
];

export const unlockPowerUps = (player: Player): void => {
  if (player.level >= 3 && !player.powerUps.fiftyFifty) {
    player.powerUps = {
      ...player.powerUps,
      fiftyFifty: true,
      freezeTime: true,
      hint: true
    };
    toast.success('Power-ups unlocked! 🎮');
  }
};

export const checkBadgeProgress = (
  player: Player,
  correctAnswers: number,
  timeLeft: number,
  badges: Badge[]
): Badge[] => {
  return badges.map(badge => {
    const updatedBadge = { ...badge };
    
    switch (badge.id) {
      case 'word-wizard':
        if (!badge.unlocked) {
          updatedBadge.progress = (badge.progress || 0) + (correctAnswers ? 1 : 0);
          if (updatedBadge.progress >= badge.requirement) {
            updatedBadge.unlocked = true;
            toast.success(`Badge Unlocked: ${badge.title}! 🏆`);
          }
        }
        break;
      
      case 'speedster':
        if (!badge.unlocked && timeLeft > 5 && correctAnswers) {
          updatedBadge.progress = (badge.progress || 0) + 1;
          if (updatedBadge.progress >= badge.requirement) {
            updatedBadge.unlocked = true;
            toast.success(`Badge Unlocked: ${badge.title}! ⚡`);
          }
        }
        break;
      
      // Additional badge checks implemented similarly
    }
    
    return updatedBadge;
  });
};