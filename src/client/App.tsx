import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [word, setWord] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Add a small delay to allow the server to start up
    const fetchTimer = setTimeout(() => {
      fetchWord();
    }, 1000);
    
    return () => clearTimeout(fetchTimer);
  }, []);
  
  const fetchWord = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/word');
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      const data = await response.json();
      setWord(data.word);
      setError('');
    } catch (error) {
      console.error('Error fetching word:', error);
      setError('Failed to connect to the game server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="app">
      <header>
        <h1>Wordle<span className="six">6</span></h1>
      </header>
      <main>
        <p>Welcome to Wordle6! This is a simple test page.</p>
        {loading ? (
          <p>Loading word from server...</p>
        ) : error ? (
          <div className="error">
            <p>{error}</p>
            <button onClick={fetchWord}>Retry Connection</button>
          </div>
        ) : (
          <p>Random word from server: <strong>{word}</strong></p>
        )}
      </main>
    </div>
  );
}

export default App;