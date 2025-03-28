import React from 'react';
import './StatsModal.css';
import { GameStats, getWinPercentage, getBestGuess } from '../services/statsService.js';

interface StatsModalProps {
  stats: GameStats;
  isOpen: boolean;
  onClose: () => void;
  onPlayAgain: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({ stats, isOpen, onClose, onPlayAgain }) => {
  if (!isOpen) return null;

  const winPercentage = getWinPercentage(stats);
  const bestGuess = getBestGuess(stats);
  
  // Find the maximum value in the guess distribution for scaling
  const maxDistribution = Math.max(...stats.guessDistribution, 1);

  return (
    <div className="stats-modal-overlay">
      <div className="stats-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Statistics</h2>
        
        <div className="stats-summary">
          <div className="stat-item">
            <div className="stat-value">{stats.gamesPlayed}</div>
            <div className="stat-label">Played</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{winPercentage}</div>
            <div className="stat-label">Win %</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.currentStreak}</div>
            <div className="stat-label">Current Streak</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.maxStreak}</div>
            <div className="stat-label">Max Streak</div>
          </div>
        </div>
        
        <h3>Guess Distribution</h3>
        
        <div className="guess-distribution">
          {stats.guessDistribution.map((count: number, index: number) => (
            <div key={index} className="guess-row">
              <div className="guess-number">{index + 1}</div>
              <div 
                className="guess-bar" 
                style={{ 
                  width: `${(count / maxDistribution) * 100}%`,
                  backgroundColor: count > 0 ? '#6aaa64' : '#e0e0e0'
                }}
              >
                <span className="guess-count">{count}</span>
              </div>
            </div>
          ))}
        </div>
        
        {bestGuess && (
          <p className="best-guess">
            Your most common success is guessing in <strong>{bestGuess} {bestGuess === 1 ? 'try' : 'tries'}</strong>
          </p>
        )}
        
        <div className="stats-actions">
          <button className="play-again-button" onClick={onPlayAgain}>
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;