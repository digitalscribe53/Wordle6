import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import GameBoard from './components/GameBoard.js';
import Keyboard from './components/Keyboard.js';
import Header from './components/Header.js';
import StatsModal from './components/StatsModal.jsx';
import { GameStats, loadStats, updateStats } from './services/statsService.js';
import { SavedGameState, saveGameState, loadGameState, clearGameState, isGameStateValid } from './services/gameStorage.js';

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
  
  // Stats state
  const [stats, setStats] = useState<GameStats>(loadStats());
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);

  // Fetch a random word from the server
  const fetchWord = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Add a small delay to allow the server to start up
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

  // Initialize game - check for saved game state first
  useEffect(() => {
    const savedState = loadGameState();
    
    // If there's a saved game and it's still valid, restore it
    if (savedState && isGameStateValid(savedState)) {
      setTargetWord(savedState.targetWord);
      setGuesses(savedState.guesses);
      setCurrentGuess(savedState.currentGuess);
      setGameStatus(savedState.gameStatus);
      setIsLoading(false);
    } else {
      // Otherwise fetch a new word
      fetchWord();
    }
  }, [fetchWord]);
  
  // Save game state whenever it changes
  useEffect(() => {
    // Only save once the game is loaded and we have a target word
    if (!isLoading && targetWord) {
      const gameState: SavedGameState = {
        targetWord,
        guesses,
        currentGuess,
        gameStatus,
        lastUpdated: Date.now()
      };
      
      saveGameState(gameState);
    }
  }, [isLoading, targetWord, guesses, currentGuess, gameStatus]);

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
      // Update stats with a win and the number of guesses
      const updatedStats = updateStats(true, newGuesses.length);
      setStats(updatedStats);
      // Show stats modal after winning
      setTimeout(() => setShowStatsModal(true), 1500);
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameStatus('lost');
      // Update stats with a loss
      const updatedStats = updateStats(false);
      setStats(updatedStats);
      // Show stats modal after losing
      setTimeout(() => setShowStatsModal(true), 1500);
    }
  };

  // Reset the game
  const resetGame = () => {
    setGuesses([]);
    setCurrentGuess('');
    setGameStatus('playing');
    setError('');
    setShowStatsModal(false);
    // Clear the saved game state
    clearGameState();
    // Fetch a new word
    fetchWord();
  };
  
  // Toggle stats modal
  const toggleStatsModal = () => {
    setShowStatsModal(!showStatsModal);
  };

  return (
    <div className="app">
      <Header resetGame={resetGame} showStats={toggleStatsModal} />
      
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
          
          <StatsModal
            stats={stats}
            isOpen={showStatsModal}
            onClose={toggleStatsModal}
            onPlayAgain={resetGame}
          />
        </>
      )}
    </div>
  );
}

export default App;