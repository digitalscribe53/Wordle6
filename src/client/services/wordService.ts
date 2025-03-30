// src/client/services/wordService.ts

// Embedded fallback word list in case words.json can't be loaded
const FALLBACK_WORDS: string[] = [
    "PUZZLE", "OXYGEN", "ZOMBIE", "QUARTZ", "RHYTHM", 
    "JACKET", "WALNUT", "FLIGHT", "COPPER", "DINNER",
    "TICKET", "SINGER", "JUNGLE", "SHIELD", "KNIGHT",
    "TEMPLE", "MARBLE", "FLOWER", "SUNSET", "PLANET"
  ];
  
  // Cache the word list once it's loaded
  let wordList: string[] | null = null;
  
  /**
   * Loads the word list from the JSON file or uses fallback
   */
  export const loadWordList = async (): Promise<string[]> => {
    if (wordList) return wordList;
    
    try {
      // Try to fetch the word list from the server
      const response = await fetch('/words.json');
      if (!response.ok) {
        throw new Error(`Failed to load word list: ${response.status}`);
      }
      const data = await response.json();
      
      // Check if we got a valid array of words
      if (Array.isArray(data) && data.length > 0) {
        wordList = data;
        console.log(`Loaded ${wordList.length} words from JSON file`);
        return wordList;
      } else {
        throw new Error('Invalid word list format');
      }
    } catch (error) {
      console.error('Error loading word list:', error);
      console.log('Using fallback word list');
      // Use the fallback list
      wordList = FALLBACK_WORDS;
      return wordList;
    }
  };
  
  /**
   * Get a random word from the list
   */
  export const getRandomWord = async (): Promise<string> => {
    const words = await loadWordList();
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  };
  
  /**
   * Check if a word is valid (exists in our word list)
   */
  export const isValidWord = async (word: string): Promise<boolean> => {
    const words = await loadWordList();
    return words.includes(word.trim().toUpperCase());
  };
  
  // Pre-load the word list when the module is imported
  loadWordList().catch(error => console.error('Failed to pre-load word list:', error));