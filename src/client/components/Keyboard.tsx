import React, { useState } from 'react';
import './Keyboard.css';
import { getKeyStatus } from '../utils/wordUtils.js';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  guesses: string[];
  targetWord: string;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, guesses, targetWord }) => {
  // State to track which key was just pressed (for animation)
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  
  // Keyboard layout
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  // Handle key press with animation
  const handleKeyPress = (key: string) => {
    // Set the pressed key for animation
    setPressedKey(key);
    
    // Remove the animation class after animation completes
    setTimeout(() => {
      setPressedKey(null);
    }, 100);
    
    // Call the onKeyPress function from props
    onKeyPress(key);
  };

  // Get an accessible label for a key based on its status
  const getKeyAriaLabel = (key: string, status: string) => {
    if (key === 'ENTER') return 'Submit guess';
    if (key === 'BACKSPACE') return 'Delete letter';
    
    let statusText = '';
    if (status === 'correct') {
      statusText = 'letter is in the correct position';
    } else if (status === 'present') {
      statusText = 'letter is in the word but wrong position';
    } else if (status === 'absent') {
      statusText = 'letter is not in the word';
    }
    
    return `${key} ${statusText}`.trim();
  };

  // Render keyboard rows
  return (
    <div className="keyboard" role="group" aria-label="Keyboard">
      {rows.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className="keyboard-row"
          role="group"
          aria-label={`Keyboard row ${rowIndex + 1}`}
        >
          {row.map(key => {
            const keyStatus = getKeyStatus(key, guesses, targetWord);
            const isPressed = key === pressedKey;
            
            return (
              <button
                key={key}
                className={`key ${keyStatus} ${isPressed ? 'key-pressed' : ''} ${key === 'ENTER' || key === 'BACKSPACE' ? 'special-key' : ''}`}
                onClick={() => handleKeyPress(key)}
                aria-label={getKeyAriaLabel(key, keyStatus)}
                aria-pressed={isPressed ? 'true' : 'false'}
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