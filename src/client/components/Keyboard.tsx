import React from 'react';
import './Keyboard.css';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  guesses: string[];
  targetWord: string;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, guesses, targetWord }) => {
  // Keyboard layout
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  // Calculate key status based on previous guesses
  const getKeyStatus = (key: string) => {
    if (key === 'ENTER' || key === 'BACKSPACE') return '';
    
    let status = '';
    
    // Check all guesses to determine the status of each key
    for (const guess of guesses) {
      const indices = [...guess].map((letter, index) => letter === key ? index : -1).filter(index => index !== -1);
      
      for (const index of indices) {
        if (guess[index] === targetWord[index]) {
          return 'correct'; // If the key was ever in the correct position, mark it as correct
        } else if (targetWord.includes(key)) {
          status = 'present'; // If the key is in the word but not correct yet, mark as present
        } else if (status === '') {
          status = 'absent'; // If the key isn't in the word and we haven't marked it otherwise, mark as absent
        }
      }
    }
    
    return status;
  };

  // Render keyboard rows
  return (
    <div className="keyboard">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map(key => (
            <button
              key={key}
              className={`key ${getKeyStatus(key)} ${key === 'ENTER' || key === 'BACKSPACE' ? 'special-key' : ''}`}
              onClick={() => onKeyPress(key)}
            >
              {key === 'BACKSPACE' ? '←' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;