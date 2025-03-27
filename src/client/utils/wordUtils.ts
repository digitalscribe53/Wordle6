/**
 * Types of letter feedback in Wordle
 */
export type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

/**
 * Result of checking a single letter
 */
export interface LetterResult {
  letter: string;
  status: LetterStatus;
}

/**
 * Result of checking a complete word
 */
export interface WordCheckResult {
  word: string;
  letters: LetterResult[];
  isCorrect: boolean;
}

/**
 * Checks a guess against the target word and returns detailed feedback
 * 
 * @param guess The player's guessed word (must be same length as target)
 * @param target The target word to check against
 * @returns Object containing detailed feedback on each letter
 */
export function checkWord(guess: string, target: string): WordCheckResult {
  // Convert both strings to uppercase for case-insensitive comparison
  const uppercaseGuess = guess.toUpperCase();
  const uppercaseTarget = target.toUpperCase();
  
  if (uppercaseGuess.length !== uppercaseTarget.length) {
    throw new Error('Guess and target must be the same length');
  }
  
  // Create a frequency map of letters in the target word
  // This helps us handle duplicate letters correctly
  const targetLetterCounts: Record<string, number> = {};
  for (const letter of uppercaseTarget) {
    targetLetterCounts[letter] = (targetLetterCounts[letter] || 0) + 1;
  }
  
  // First pass: Mark correct letters and update remaining counts
  const results: LetterResult[] = Array(uppercaseGuess.length).fill(null);
  const remainingLetterCounts = { ...targetLetterCounts };
  
  // First identify all correct letters
  for (let i = 0; i < uppercaseGuess.length; i++) {
    const guessLetter = uppercaseGuess[i];
    
    if (guessLetter === uppercaseTarget[i]) {
      results[i] = { letter: guessLetter, status: 'correct' };
      remainingLetterCounts[guessLetter]--;
    }
  }
  
  // Then process the remaining letters for 'present' or 'absent'
  for (let i = 0; i < uppercaseGuess.length; i++) {
    // Skip positions that were already marked as correct
    if (results[i] !== null) continue;
    
    const guessLetter = uppercaseGuess[i];
    
    if (remainingLetterCounts[guessLetter] && remainingLetterCounts[guessLetter] > 0) {
      // The letter exists in the target and we haven't used all occurrences
      results[i] = { letter: guessLetter, status: 'present' };
      remainingLetterCounts[guessLetter]--;
    } else {
      // Either the letter isn't in the target word or all occurrences are used
      results[i] = { letter: guessLetter, status: 'absent' };
    }
  }
  
  return {
    word: uppercaseGuess,
    letters: results,
    isCorrect: uppercaseGuess === uppercaseTarget
  };
}

/**
 * Gets the keyboard key status based on all previous guesses
 * 
 * @param key The keyboard key to check
 * @param guesses Array of previous guesses
 * @param target The target word
 * @returns The status for the keyboard key ('correct', 'present', 'absent', or '')
 */
export function getKeyStatus(key: string, guesses: string[], target: string): LetterStatus | '' {
  const uppercaseKey = key.toUpperCase();
  
  // Special keys
  if (uppercaseKey === 'ENTER' || uppercaseKey === 'BACKSPACE') {
    return '';
  }
  
  // Initialize with empty string
  let bestStatus = '';
  
  // Check each guess for this key
  for (const guess of guesses) {
    const result = checkWord(guess, target);
    
    for (const letterResult of result.letters) {
      if (letterResult.letter === uppercaseKey) {
        // Prioritize status in order: correct > present > absent
        if (letterResult.status === 'correct') {
          return 'correct'; // Immediately return the highest priority
        } else if (letterResult.status === 'present' && bestStatus !== 'present') {
          bestStatus = 'present';
        } else if (letterResult.status === 'absent' && bestStatus === '') {
          bestStatus = 'absent';
        }
      }
    }
  }
  
  return bestStatus as LetterStatus | '';
}