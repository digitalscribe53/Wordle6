/**
 * This module handles the word list for the Wordle6 game
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name using ES modules pattern
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the word list file
const wordListPath = path.join(__dirname, 'six-letter-words.txt');

// Store the word list in memory after initial load
let wordList: string[] = [];

/**
 * Load all words from the file
 */
export function loadWordList(): string[] {
  if (wordList.length > 0) {
    return wordList; // Return cached list if already loaded
  }

  try {
    const fileContent = fs.readFileSync(wordListPath, 'utf-8');
    wordList = fileContent
      .split('\n')
      .map(word => word.trim().toUpperCase())
      .filter(word => word.length === 6 && /^[A-Z]+$/.test(word));
    
    console.log(`Loaded ${wordList.length} six-letter words`);
    return wordList;
  } catch (error) {
    console.error('Error loading word list:', error);
    return [];
  }
}

/**
 * Get a random word from the list
 */
export function getRandomWord(): string {
  const words = loadWordList();
  if (words.length === 0) {
    // Fallback to a default word if the list is empty
    return 'PUZZLE';
  }
  
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}

/**
 * Check if a word is valid (exists in our word list)
 */
export function isValidWord(word: string): boolean {
  const words = loadWordList();
  return words.includes(word.trim().toUpperCase());
}

// Load the word list on module initialization
loadWordList();