import React, { useEffect, useState } from 'react';

interface GameStatusAnnouncerProps {
  gameStatus: 'playing' | 'won' | 'lost';
  targetWord?: string;
  guessCount?: number;
}

// This is a visually hidden component that announces important game events to screen readers
const GameStatusAnnouncer: React.FC<GameStatusAnnouncerProps> = ({ 
  gameStatus, 
  targetWord, 
  guessCount = 0 
}) => {
  const [announcement, setAnnouncement] = useState<string>('');
  
  useEffect(() => {
    if (gameStatus === 'won') {
      setAnnouncement(`Congratulations! You won the game by correctly guessing the word ${targetWord} in ${guessCount} ${guessCount === 1 ? 'try' : 'tries'}.`);
    } else if (gameStatus === 'lost') {
      setAnnouncement(`Game over. The word was ${targetWord}. Better luck next time!`);
    } else {
      setAnnouncement('');
    }
  }, [gameStatus, targetWord, guessCount]);
  
  // This style hides the element visually but keeps it accessible to screen readers
  const hiddenStyle: React.CSSProperties = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0'
  };
  
  return (
    <div 
      style={hiddenStyle} 
      role="status" 
      aria-live="polite"
      aria-atomic="true"
    >
      {announcement}
    </div>
  );
};

export default GameStatusAnnouncer;