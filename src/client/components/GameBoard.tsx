import React, { useState, useEffect } from 'react';
import './GameBoard.css';
import { checkWord, LetterStatus } from '../utils/wordUtils.js';

interface GameBoardProps {
  guesses: string[];
  currentGuess: string;
  targetWord: string;
  wordLength: number;
  maxGuesses: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  guesses, 
  currentGuess, 
  targetWord, 
  wordLength, 
  maxGuesses 
}) => {
  // State to track which row has just been submitted (for animations)
  const [lastSubmittedRow, setLastSubmittedRow] = useState<number>(-1);
  // State to track if the win animation should be shown
  const [showWinAnimation, setShowWinAnimation] = useState<boolean>(false);

  // Update lastSubmittedRow when a new guess is added
  useEffect(() => {
    if (guesses.length > 0) {
      setLastSubmittedRow(guesses.length - 1);
      
      // Check if the last guess was correct
      const lastGuess = guesses[guesses.length - 1];
      if (lastGuess.toUpperCase() === targetWord.toUpperCase()) {
        // Delay win animation until after flip animation
        setTimeout(() => {
          setShowWinAnimation(true);
        }, 1500); // Wait longer than all flip animations
      }
    }
  }, [guesses.length, guesses, targetWord]);

  // Create rows for previous guesses
  const rows = [];
  
  // Add submitted guesses
  for (let i = 0; i < guesses.length; i++) {
    const guess = guesses[i];
    const result = checkWord(guess, targetWord);
    
    // Check if this row should show the win animation
    const isWinningRow = i === guesses.length - 1 && 
                         guess.toUpperCase() === targetWord.toUpperCase() && 
                         showWinAnimation;
    
    const rowCells = result.letters.map((letterResult, j) => (
      <div 
        key={j} 
        className={`cell ${letterResult.status} ${i === lastSubmittedRow ? 'flip' : ''}`}
      >
        {letterResult.letter}
      </div>
    ));
    
    rows.push(
      <div 
        key={i} 
        className={`row ${isWinningRow ? 'win-animation' : ''}`}
      >
        {rowCells}
      </div>
    );
  }
  
  // Add current guess
  if (guesses.length < maxGuesses) {
    const currentGuessRow = [];
    
    // Fill in the letters that have been typed
    for (let i = 0; i < wordLength; i++) {
      currentGuessRow.push(
        <div 
          key={i} 
          className={`cell ${i < currentGuess.length ? 'filled' : 'empty'}`}
        >
          {i < currentGuess.length ? currentGuess[i] : ''}
        </div>
      );
    }
    
    rows.push(<div key="current" className="row">{currentGuessRow}</div>);
    
    // Add empty rows for remaining guesses
    for (let i = guesses.length + 1; i < maxGuesses; i++) {
      const emptyRow = Array(wordLength).fill(null).map((_, j) => (
        <div key={j} className="cell empty"></div>
      ));
      
      rows.push(<div key={i} className="row">{emptyRow}</div>);
    }
  }
  
  return (
    <div className="game-board">
      {rows}
    </div>
  );
};

export default GameBoard;