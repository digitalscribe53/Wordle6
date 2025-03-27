import React from 'react';
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
  // Create rows for previous guesses
  const rows = [];
  
  // Add submitted guesses
  for (let i = 0; i < guesses.length; i++) {
    const guess = guesses[i];
    const result = checkWord(guess, targetWord);
    const rowCells = result.letters.map((letterResult, j) => (
      <div key={j} className={`cell ${letterResult.status}`}>
        {letterResult.letter}
      </div>
    ));
    
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