import { calculateXP, calculateLevel, updateStreak, checkBadgeProgress } from '../utils/gamification';
import { Player, Badge } from '../types';

describe('Gamification Features', () => {
  describe('XP and Level Calculation', () => {
    it('calculates base XP correctly', () => {
      expect(calculateXP(3, 0)).toBe(30);
    });

    it('adds streak bonus XP', () => {
      expect(calculateXP(3, 7)).toBe(50); // 30 base + 20 bonus
    });

    it('calculates level based on XP', () => {
      expect(calculateLevel(250)).toBe(2);
    });
  });

  describe('Streak System', () => {
    it('increments streak on correct answer', () => {
      const player = { streak: 2 } as Player;
      expect(updateStreak(player, true)).toBe(3);
    });

    it('resets streak on wrong answer', () => {
      const player = { streak: 4 } as Player;
      expect(updateStreak(player, false)).toBe(0);
    });
  });

  describe('Badge Progress', () => {
    let testBadges: Badge[];
    
    beforeEach(() => {
      testBadges = [
        {
          id: 'speedster',
          title: 'Speedster',
          description: 'Fast answers',
          unlocked: false,
          progress: 0,
          requirement: 5
        }
      ];
    });

    it('updates badge progress correctly', () => {
      const player = {} as Player;
      const updatedBadges = checkBadgeProgress(player, 1, 6, testBadges);
      expect(updatedBadges[0].progress).toBe(1);
    });

    it('unlocks badge when requirement met', () => {
      const player = {} as Player;
      testBadges[0].progress = 4;
      const updatedBadges = checkBadgeProgress(player, 1, 6, testBadges);
      expect(updatedBadges[0].unlocked).toBe(true);
    });
  });
});