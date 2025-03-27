import React, { useState } from 'react';
import './Header.css';

interface HeaderProps {
  resetGame: () => void;
}

const Header: React.FC<HeaderProps> = ({ resetGame }) => {
  const [showRules, setShowRules] = useState<boolean>(false);

  return (
    <header className="header">
      <h1>Wordle<span className="six">6</span></h1>
      
      <div className="controls">
        <button 
          className="rules-button" 
          onClick={() => setShowRules(!showRules)}
        >
          Rules
        </button>
        
        <button 
          className="new-game-button" 
          onClick={resetGame}
        >
          New Game
        </button>
      </div>
      
      {showRules && (
        <div className="rules-modal">
          <div className="rules-content">
            <h2>How to Play</h2>
            <button 
              className="close-button" 
              onClick={() => setShowRules(false)}
            >
              ×
            </button>
            
            <ul>
              <li>Guess the Wordle6 in 6 tries.</li>
              <li>Each guess must be a valid 6-letter word.</li>
              <li>The color of the tiles will change to show how close your guess was.</li>
            </ul>
            
            <div className="examples">
              <p><strong>Examples:</strong></p>
              
              <div className="example">
                <div className="cell correct">P</div>
                <div className="cell">U</div>
                <div className="cell">Z</div>
                <div className="cell">Z</div>
                <div className="cell">L</div>
                <div className="cell">E</div>
                <p>The letter P is in the word and in the correct spot.</p>
              </div>
              
              <div className="example">
                <div className="cell">S</div>
                <div className="cell present">E</div>
                <div className="cell">C</div>
                <div className="cell">R</div>
                <div className="cell">E</div>
                <div className="cell">T</div>
                <p>The letter E is in the word but in the wrong spot.</p>
              </div>
              
              <div className="example">
                <div className="cell">T</div>
                <div className="cell">A</div>
                <div className="cell">C</div>
                <div className="cell absent">K</div>
                <div className="cell">L</div>
                <div className="cell">E</div>
                <p>The letter K is not in the word in any spot.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;