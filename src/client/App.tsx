import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import GameBoard from './components/GameBoard.js';
import Keyboard from './components/Keyboard.js';
import Header from './components/Header.js';

// Game constants
const WORD_LENGTH = 6;  // For Wordle6, we use 6-letter words
const MAX_GUESSES = 6;  // Players get 6 attempts

function App() {
  // Game state
  const [targetWord, setTargetWord] = useState<string>('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [error, setError] = useState<string>('');
  const [shake, setShake] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch a random word from the server
  const fetchWord = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await fetch('/api/word');
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      setTargetWord(data.word.toUpperCase());
    } catch (error) {
      console.error('Error fetching word:', error);
      setError('Failed to connect to the game server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize game
  useEffect(() => {
    fetchWord();
  }, [fetchWord]);

  // Handle keyboard input
  const handleKeyPress = useCallback((key: string) => {
    if (gameStatus !== 'playing' || isLoading) return;

    // Handle different key types
    if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (key === 'ENTER') {
      submitGuess();
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key);
    }
  }, [currentGuess, gameStatus, isLoading]);

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Backspace') {
        handleKeyPress('BACKSPACE');
      } else if (event.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (/^[a-zA-Z]$/.test(event.key)) {
        handleKeyPress(event.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  // Validate and submit a guess
  const submitGuess = async () => {
    // Check if the guess is complete
    if (currentGuess.length !== WORD_LENGTH) {
      setError(`Please enter a ${WORD_LENGTH}-letter word`);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    // Validate the word against our dictionary
    try {
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: currentGuess })
      });

      const data = await response.json();

      if (!data.valid) {
        setError(`${currentGuess} is not in the word list`);
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }
    } catch (error) {
      console.error('Error validating word:', error);
      // If validation fails, we'll still accept the word for now
    }

    // Add the guess to the list
    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');
    setError('');

    // Check for win or loss
    if (currentGuess.toUpperCase() === targetWord.toUpperCase()) {
      setGameStatus('won');
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameStatus('lost');
    }
  };

  // Reset the game
  const resetGame = () => {
    setGuesses([]);
    setCurrentGuess('');
    setGameStatus('playing');
    setError('');
    fetchWord();
  };

  return (
    <div className="app">
      <Header resetGame={resetGame} />
      
      {isLoading ? (
        <div className="loading">Loading game...</div>
      ) : (
        <>
          <GameBoard 
            guesses={guesses} 
            currentGuess={currentGuess} 
            targetWord={targetWord} 
            wordLength={WORD_LENGTH}
            maxGuesses={MAX_GUESSES}
          />
          
          {error && <div className={`error-message ${shake ? 'shake' : ''}`}>{error}</div>}
          
          <Keyboard 
            onKeyPress={handleKeyPress} 
            guesses={guesses} 
            targetWord={targetWord}
          />
          
          {gameStatus === 'won' && (
            <div className="message win">
              <p>Congratulations! You won!</p>
              <button onClick={resetGame}>Play Again</button>
            </div>
          )}
          
          {gameStatus === 'lost' && (
            <div className="message lose">
              <p>Game over! The word was <strong>{targetWord}</strong></p>
              <button onClick={resetGame}>Play Again</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;