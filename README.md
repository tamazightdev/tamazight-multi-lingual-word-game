## Tamazight Multi Lingual Word Game

Welcome: Imagine a world where language learning feels as natural as a game. You arrive on the first screen, greeted by a burst of color, a clear invitation to begin, and an instant sense that you're about to do something meaningful—in this case, learn Tamazight vocabulary through play. That's no accident. Every element of this app was designed with intention: to engage, to delight, and to educate.

## Why This App Exists

Too often, language apps feel sterile or overwhelming. You're bombarded with lists of words, grammatical rules, and endless exercises that feel disconnected from real usage. We asked: What if you could learn through challenge, competition, and community? Enter the Tamazight Multilingual Word Game. It combines the joy of a quiz show with the social spirit of friendly rivalry. Whether you're solo or paired up, you'll translate Tamazight words, rack up points, and watch leaderboards update in real time. All the while, you're immersed in a world of vibrant colors and glassy, modern design.

## Core Features & Functionality

### Game Modes
* **1-Player Mode**: Challenge yourself and improve your vocabulary
* **2-Player Mode**: Compete with a friend in turn-based gameplay
* **Multiple Languages**: Translate into English, German, French, Spanish, Italian, Hungarian, Finnish, or Arabic

### Gamification Features
* **Streak System**
  * Track consecutive correct answers
  * Visual flame indicator for 3+ streaks
  * Bonus points: +1 at streak 5, +2 at streak 7
  * Daily play streaks with toast notifications

* **XP & Leveling**
  * +10 XP per correct answer
  * Level up every 100 XP
  * Animated XP bar under player avatars
  * Persistent progression system

* **Badges & Achievements**
  * Word Wizard: 10 correct in one language
  * Speedster: 5 fast correct answers
  * Perfect Round: No mistakes
  * Comeback King/Queen: Win after 6+ point deficit
  * Polyglot Beginner: Use 3+ languages

* **Power-Ups** (Unlocked at Level 3)
  * 50/50: Removes one wrong option
  * Freeze Time: Pauses timer for 5 seconds
  * Hint: Shows first letter of correct answer

### Dynamic Difficulty
* Adaptive distractor selection based on performance
* Optional Easy Mode suggestion after multiple mistakes
* Time pressure with visual countdown

### High Scores & Persistence
* SQLite-based leaderboard system
* Tracks combined scores, XP, and levels
* Automatic migration from localStorage
* Daily streak tracking

## Getting Started

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/tamazight-multilingual-word-game.git
   cd tamazight-multilingual-word-game
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run in Development Mode**

   ```bash
   npm run dev
   ```

4. **Run Tests**

   ```bash
   npm test
   ```

## Technology Stack

* **Frontend**: React + TypeScript
* **Styling**: Tailwind CSS
* **State Management**: React Context
* **Database**: better-sqlite3
* **Testing**: Jest + React Testing Library
* **Icons**: Lucide React
* **Notifications**: React Hot Toast

## Project Structure

```
src/
├── api/
│   └── highscores.ts      # Database operations
├── components/
│   ├── BadgeGallery.tsx   # Achievement display
│   ├── PowerUpBar.tsx     # Power-ups interface
│   ├── QuizScreen.tsx     # Main game screen
│   └── ...
├── context/
│   ├── AudioContext.tsx   # Sound management
│   └── GameContext.tsx    # Game state & logic
├── utils/
│   └── gamification.ts    # Game mechanics
└── types/
    └── index.ts           # TypeScript definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Add tests for new functionality
5. Submit a PR with a clear description

## Testing

The project includes comprehensive tests for game mechanics:

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage
```

Key test suites:
- XP and leveling calculations
- Streak system behavior
- Badge progress tracking
- Power-up functionality

## Accessibility

The game implements several accessibility features:
- ARIA live regions for score updates
- Keyboard navigation for all interactions
- High contrast color schemes
- Screen reader friendly notifications
- Proper focus management

## License

MIT License - see LICENSE.md

## Acknowledgments

Special thanks to the Tamazight language community for their support and feedback in making this educational tool both authentic and engaging.

---

Built with ❤️ by Gregory Kennedy