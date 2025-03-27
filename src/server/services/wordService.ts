
const sixLetterWords = [
    'PUZZLE', 'OXYGEN', 'ZOMBIE', 'QUARTZ', 'RHYTHM', 
    'JACKET', 'WALNUT', 'FLIGHT', 'COPPER', 'DINNER',
    'TICKET', 'SINGER', 'JUNGLE', 'SHIELD', 'KNIGHT',
    'TEMPLE', 'MARBLE', 'FLOWER', 'SUNSET', 'PLANET',
    'BASKET', 'SECRET', 'TURTLE', 'DRAGON', 'FOREST',
    'MARKET', 'MINUTE', 'WINDOW', 'BRIGHT', 'SCHOOL'
  ];
  
  // Check if a word is valid (in the dictionary)
  export const isValidWord = (word: string): boolean => {
    return sixLetterWords.includes(word.toUpperCase());
  };
  
  // Get a random word from the dictionary
  export const getRandomWord = (): string => {
    const randomIndex = Math.floor(Math.random() * sixLetterWords.length);
    return sixLetterWords[randomIndex];
  };
  
  // Later, we will expand this with:
  // - Loading words from a file
  // - Checking valid guesses against a larger dictionary
  