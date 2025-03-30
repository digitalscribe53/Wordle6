// App.tsx - Updated to use client-side word handling

import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import GameBoard from './components/GameBoard.js';
import Keyboard from './components/Keyboard.js';
import Header from './components/Header.js';
import StatsModal from './components/StatsModal.jsx';
import GameStatusAnnouncer from './components/GameStatusAnnouncer.js';
import PWAInstallPrompt from './components/PWAInstallPrompt.js';
import NetworkStatus from './components/NetworkStatus.js';
import { GameStats, loadStats, updateStats } from './services/statsService.js';
import { SavedGameState, saveGameState, loadGameState, clearGameState, isGameStateValid } from './services/gameStorage.js';
import { getRandomWord, isValidWord } from './services/wordService.js';
import { ThemeProvider } from './context/ThemeContext.js';

// Game constants
const WORD_LENGTH = 6;  // For Wordle6, we use 6-letter words
const MAX_GUESSES = 6;  // Players get 6 attempts

// Fallback words in case word service fails
const FALLBACK_WORDS = ["PUZZLE", "OXYGEN", "ZOMBIE", "QUARTZ", "RHYTHM", "JACKET"];

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

  // Fetch a random word using the client-side word service
  const fetchWord = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      
      try {
        // Use client-side word service instead of API
        const word = await getRandomWord();
        if (word) {
          setTargetWord(word.toUpperCase());
        } else {
          // Use fallback if no word returned
          const fallbackWord = FALLBACK_WORDS[Math.floor(Math.random() * FALLBACK_WORDS.length)];
          setTargetWord(fallbackWord);
          console.warn('Using fallback word');
        }
      } catch (error) {
        console.error('Error getting random word:', error);
        // Fallback to a default word
        const fallbackWord = FALLBACK_WORDS[Math.floor(Math.random() * FALLBACK_WORDS.length)];
        setTargetWord(fallbackWord);
      }
    } catch (error) {
      console.error('Error in fetchWord:', error);
      setError('Failed to load a word. Using default word instead.');
      setTargetWord('PUZZLE'); // Ensure we always have a word
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

    // Validate the word using client-side validation
    try {
      const valid = await isValidWord(currentGuess);
      
      if (!valid) {
        setError(`${currentGuess} is not in the word list`);
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setCurrentGuess(''); // Clear invalid guess after animation
        }, 1000);
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
      // Delay the game status update slightly to allow for animations
      setTimeout(() => {
        setGameStatus('won');
        // Update stats with a win and the number of guesses
        const updatedStats = updateStats(true, newGuesses.length);
        setStats(updatedStats);
        // Show stats modal after winning (after animations)
        setTimeout(() => setShowStatsModal(true), 2000);
      }, 1500); // This allows time for the flip animations to complete
    } else if (newGuesses.length >= MAX_GUESSES) {
      // Delay the game status update slightly
      setTimeout(() => {
        setGameStatus('lost');
        // Update stats with a loss
        const updatedStats = updateStats(false);
        setStats(updatedStats);
        // Show stats modal after losing
        setTimeout(() => setShowStatsModal(true), 1000);
      }, 1500); // This allows time for the flip animations to complete
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
    <ThemeProvider>
      <div className="app">
        <Header resetGame={resetGame} showStats={toggleStatsModal} />
        
        {/* Main title for screen readers */}
        <h1 className="sr-only">Wordle6 - A 6-letter word guessing game</h1>
        
        {/* Network status indicator */}
        <NetworkStatus />
        
        {/* Game status announcer for screen readers */}
        <GameStatusAnnouncer 
          gameStatus={gameStatus} 
          targetWord={targetWord}
          guessCount={guesses.length}
        />
        
        {isLoading ? (
          <div className="loading" aria-live="polite">Loading game...</div>
        ) : (
          <>
            <GameBoard 
              guesses={guesses} 
              currentGuess={currentGuess} 
              targetWord={targetWord} 
              wordLength={WORD_LENGTH}
              maxGuesses={MAX_GUESSES}
            />
            
            {error && <div className={`error-message ${shake ? 'shake' : ''}`} aria-live="assertive">{error}</div>}
            
            <Keyboard 
              onKeyPress={handleKeyPress} 
              guesses={guesses} 
              targetWord={targetWord}
            />
            
            {gameStatus === 'won' && (
              <div className="message win" role="alert" aria-live="polite">
                <p>Congratulations! You won!</p>
                <button onClick={resetGame}>Play Again</button>
              </div>
            )}
            
            {gameStatus === 'lost' && (
              <div className="message lose" role="alert" aria-live="polite">
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
        
        {/* PWA Install Prompt */}
        <PWAInstallPrompt />
      </div>
    </ThemeProvider>
  );
}

export default App;