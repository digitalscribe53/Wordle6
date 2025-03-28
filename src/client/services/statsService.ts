/**
 * Interface for game statistics
 */
export interface GameStats {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    maxStreak: number;
    guessDistribution: number[];
    lastCompleted: string | null;
  }
  
  /**
   * Default statistics for a new player
   */
  const DEFAULT_STATS: GameStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0], // Distribution for 1-6 guesses
    lastCompleted: null,
  };
  
  // Local storage key
  const STATS_KEY = 'wordle6_stats';
  
  /**
   * Load statistics from local storage
   */
  export function loadStats(): GameStats {
    try {
      const savedStats = localStorage.getItem(STATS_KEY);
      if (savedStats) {
        return JSON.parse(savedStats);
      }
    } catch (error) {
      console.error('Error loading stats from local storage:', error);
    }
  
    // Return default stats if none exist or there was an error
    return { ...DEFAULT_STATS };
  }
  
  /**
   * Save statistics to local storage
   */
  export function saveStats(stats: GameStats): void {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving stats to local storage:', error);
    }
  }
  
  /**
   * Update statistics after a game ends
   * @param won Whether the player won the game
   * @param numGuesses Number of guesses taken (only relevant if won is true)
   */
  export function updateStats(won: boolean, numGuesses: number = 0): GameStats {
    const stats = loadStats();
    const today = new Date().toDateString();
  
    // Update general stats - no longer checking lastCompleted
    stats.gamesPlayed += 1;
    
    if (won) {
      // Update win-related stats
      stats.gamesWon += 1;
      stats.currentStreak += 1;
      stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
      
      // Update guess distribution (0-indexed array, so subtract 1)
      if (numGuesses > 0 && numGuesses <= 6) {
        stats.guessDistribution[numGuesses - 1] += 1;
      }
    } else {
      // Reset streak on loss
      stats.currentStreak = 0;
    }
  
    // Record the last completed date (for daily challenges if implemented later)
    stats.lastCompleted = today;
    
    // Save the updated stats
    saveStats(stats);
    
    return stats;
  }
  
  /**
   * Calculate win percentage
   */
  export function getWinPercentage(stats: GameStats): number {
    if (stats.gamesPlayed === 0) return 0;
    return Math.round((stats.gamesWon / stats.gamesPlayed) * 100);
  }
  
  /**
   * Get the total number of games played
   */
  export function getTotalGames(stats: GameStats): number {
    return stats.gamesPlayed;
  }
  
  /**
   * Get the best guess (the most common successful guess number)
   */
  export function getBestGuess(stats: GameStats): number | null {
    const max = Math.max(...stats.guessDistribution);
    if (max === 0) return null;
    
    // Add 1 because array is 0-indexed but we want to display 1-6
    return stats.guessDistribution.indexOf(max) + 1;
  }