import React from 'react';
import './GameBoard.css';

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
  // Create rows for previous guesses
  const rows = [];
  
  // Add submitted guesses
  for (let i = 0; i < guesses.length; i++) {
    const rowCells = [];
    const guess = guesses[i];
    
    for (let j = 0; j < wordLength; j++) {
      const letter = guess[j];
      let cellStatus = 'absent';
      
      if (letter === targetWord[j]) {
        cellStatus = 'correct';
      } else if (targetWord.includes(letter)) {
        cellStatus = 'present';
      }
      
      rowCells.push(
        <div key={j} className={`cell ${cellStatus}`}>
          {letter}
        </div>
      );
    }
    
    rows.push(<div key={i} className="row">{rowCells}</div>);
  }
  
  // Add current guess
  if (guesses.length < maxGuesses) {
    const currentGuessRow = [];
    
    // Fill in the letters that have been typed
    for (let i = 0; i < wordLength; i++) {
      currentGuessRow.push(
        <div key={i} className={`cell ${i < currentGuess.length ? 'filled' : 'empty'}`}>
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