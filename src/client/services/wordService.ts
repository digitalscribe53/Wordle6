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
  // Track if we're using fallback
  let usingFallback: boolean = false;
  // Track the last word to avoid repeats
  let lastWord: string | null = null;
  
  /**
   * Loads the word list from the JSON file or uses fallback
   */
  export const loadWordList = async (): Promise<string[]> => {
    // If we already have the word list and it's NOT the fallback, return it
    if (wordList && !usingFallback) return wordList;
    
    try {
      // Always try to fetch the file
      console.log("Attempting to load words.json...");
      const response = await fetch('/words.json');
      
      if (!response.ok) {
        console.error(`Failed to load word list: Status ${response.status}`);
        throw new Error(`Failed to load word list: ${response.status}`);
      }
      
      console.log("Response received, parsing JSON...");
      const data = await response.json();
      
      // Check if we got a valid array of words
      if (Array.isArray(data) && data.length > 0) {
        wordList = data;
        usingFallback = false;
        console.log(`Successfully loaded ${wordList.length} words from JSON file`);
        return wordList;
      } else {
        console.error("Invalid word list format", data);
        throw new Error('Invalid word list format');
      }
    } catch (error) {
      console.error('Error loading word list:', error);
      console.log('Using fallback word list with', FALLBACK_WORDS.length, 'words');
      // Use the fallback list
      wordList = FALLBACK_WORDS;
      usingFallback = true;
      return wordList;
    }
  };
  
  /**
   * Get a random word from the list
   */
  export const getRandomWord = async (): Promise<string> => {
    const words = await loadWordList();
    
    // Make sure we don't get the same word twice in a row
    let word;
    let attempts = 0;
    do {
      const randomIndex = Math.floor(Math.random() * words.length);
      word = words[randomIndex];
      attempts++;
      // If we've tried 5 times and can't get a different word, just use what we have
      if (attempts > 5) break;
    } while (word === lastWord && words.length > 1);
    
    // Remember this word for next time
    lastWord = word;
    console.log("Selected word:", word, "Using fallback list:", usingFallback);
    return word;
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