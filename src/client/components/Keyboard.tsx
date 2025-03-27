import React from 'react';
import './Keyboard.css';
import { getKeyStatus } from '../utils/wordUtils.js';

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

  // Render keyboard rows
  return (
    <div className="keyboard">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map(key => {
            const keyStatus = getKeyStatus(key, guesses, targetWord);
            return (
              <button
                key={key}
                className={`key ${keyStatus} ${key === 'ENTER' || key === 'BACKSPACE' ? 'special-key' : ''}`}
                onClick={() => onKeyPress(key)}
              >
                {key === 'BACKSPACE' ? '←' : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;