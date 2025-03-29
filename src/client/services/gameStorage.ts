/**
 * Interface for the saved game state
 */
export interface SavedGameState {
    targetWord: string;
    guesses: string[];
    currentGuess: string;
    gameStatus: 'playing' | 'won' | 'lost';
    lastUpdated: number; // timestamp
  }
  
  // Local storage key
  const GAME_STATE_KEY = 'wordle6_game_state';
  
  /**
   * Save the current game state to localStorage
   */
  export function saveGameState(state: SavedGameState): void {
    try {
      localStorage.setItem(GAME_STATE_KEY, JSON.stringify({
        ...state,
        lastUpdated: Date.now()
      }));
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  }
  
  /**
   * Load the saved game state from localStorage
   * Returns null if no saved state exists or if it's invalid
   */
  export function loadGameState(): SavedGameState | null {
    try {
      const savedState = localStorage.getItem(GAME_STATE_KEY);
      if (!savedState) return null;
      
      const parsedState = JSON.parse(savedState) as SavedGameState;
      
      // Validate the parsed state
      if (!parsedState.targetWord || 
          !Array.isArray(parsedState.guesses) || 
          typeof parsedState.gameStatus !== 'string') {
        return null;
      }
      
      return parsedState;
    } catch (error) {
      console.error('Error loading game state:', error);
      return null;
    }
  }
  
  /**
   * Clear the saved game state from localStorage
   */
  export function clearGameState(): void {
    try {
      localStorage.removeItem(GAME_STATE_KEY);
    } catch (error) {
      console.error('Error clearing game state:', error);
    }
  }
  
  /**
   * Check if the saved game state is still valid (not too old)
   * @param maxAge Maximum age in milliseconds (default: 24 hours)
   */
  export function isGameStateValid(state: SavedGameState, maxAge: number = 24 * 60 * 60 * 1000): boolean {
    if (!state || !state.lastUpdated) return false;
    
    const now = Date.now();
    const age = now - state.lastUpdated;
    
    return age <= maxAge;
  }