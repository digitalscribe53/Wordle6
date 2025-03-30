// src/client/services/wordService.js
import wordList from '/words.json'; 

export const getRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex];
};

export const validateWord = (word) => {
  return wordList.includes(word.toUpperCase());
};