import Database from 'better-sqlite3';
import { HighScore } from '../types';

const db = new Database('highscores.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS high_scores (
    id TEXT PRIMARY KEY,
    names TEXT NOT NULL,
    combined_score INTEGER NOT NULL,
    xp INTEGER NOT NULL,
    level INTEGER NOT NULL,
    date TEXT NOT NULL
  )
`);

export const getHighScores = (): HighScore[] => {
  const stmt = db.prepare('SELECT * FROM high_scores ORDER BY combined_score DESC LIMIT 5');
  return stmt.all().map(row => ({
    id: row.id,
    names: row.names,
    combinedScore: row.combined_score,
    xp: row.xp,
    level: row.level,
    date: row.date
  }));
};

export const saveHighScore = (score: HighScore): void => {
  const stmt = db.prepare(`
    INSERT INTO high_scores (id, names, combined_score, xp, level, date)
    VALUES (@id, @names, @combinedScore, @xp, @level, @date)
  `);
  
  stmt.run({
    id: score.id,
    names: score.names,
    combinedScore: score.combinedScore,
    xp: score.xp,
    level: score.level,
    date: score.date
  });
};

// Migrate existing scores from localStorage
export const migrateLocalScores = (): void => {
  const localScores = localStorage.getItem('tamazightHighScores');
  if (localScores) {
    const scores = JSON.parse(localScores) as HighScore[];
    scores.forEach(score => {
      try {
        saveHighScore(score);
      } catch (error) {
        console.error('Error migrating score:', error);
      }
    });
    localStorage.removeItem('tamazightHighScores');
  }
};