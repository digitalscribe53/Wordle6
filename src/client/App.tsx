import React, { useState, useEffect } from 'react';
import './App.css';
import GameBoard from './components/GameBoard.tsx';
import Keyboard from './components/Keyboard.tsx';
import Header from './components/Header.tsx';

function App() {
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [targetWord, setTargetWord] = useState<string>('');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  
  // Maximum number of guesses allowed
  const MAX_GUESSES = 6;
  // Word length is 6 for Wordle6
  const WORD_LENGTH = 6;

  useEffect(() => {
    // Fetch a random 6-letter word from the backend
    fetchWord();
  }, []);

  const fetchWord = async () => {
    try {
      const response = await fetch('/api/word');
      const data = await response.json();
      setTargetWord(data.word.toUpperCase());
    } catch (error) {
      console.error('Error fetching word:', error);
    }
  };

  const handleKeyPress = (key: string) => {
    if (gameStatus !== 'playing') return;
    
    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/.test(key)) {
      setCurrentGuess(prev => prev + key);
    }
  };

  const submitGuess = () => {
    if (currentGuess.length !== WORD_LENGTH) return;
    
    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');
    
    if (currentGuess === targetWord) {
      setGameStatus('won');
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameStatus('lost');
    }
  };

  const resetGame = () => {
    setCurrentGuess('');
    setGuesses([]);
    setGameStatus('playing');
    fetchWord();
  };

  return (
    <div className="app">
      <Header resetGame={resetGame} />
      <GameBoard 
        guesses={guesses} 
        currentGuess={currentGuess} 
        targetWord={targetWord} 
        wordLength={WORD_LENGTH}
        maxGuesses={MAX_GUESSES}
      />
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
          <p>Game Over! The word was {targetWord}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default App;