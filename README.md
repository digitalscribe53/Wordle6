## Wordle6
A 6-letter word guessing game inspired by the popular Wordle puzzle game. Wordle6 offers a more challenging version with 6-letter words instead of the traditional 5-letter format.

# Live Demo
[Play Wordle6 online](https://wordle6-app.netlify.app)

# Technologies Used
Frontend 
    - React: The core UI library used to build the game's component-based interface
    - TypeScript: Provides static typing for more robust code and better developer experience
    - Vite: Modern build tool that offers extremely fast development server and optimized production builds
    - CSS Modules: Used for component-specific styling to prevent style conflicts
Backend(Development Only)    
    - Node.js: JavaScript runtime used for the development server
    - Hono: Lightweight web framework used to create the development API for word selection and validation
    - ts-node: TypeScript execution environment used to run the development server
Game Features
    - LocalStorage: Implements game state persistence between sessions
    - Service Workers: Powers PWA functionality for offline play and installation
    - Web Manifest: Enables PWA installation on mobile and desktop devices
Deployment 
    - Netlify: Platform used for hosting the static frontend build
    - Client-side Word Processing: Migrated server functionality to the client for static hosting

# Implementation Details
    - React + TypeScript: The game is built using functional React components with TypeScript for type safety.   Components are organized by feature, with separation of UI elements and game logic.
    - Hono Framework: Used during development to create a lightweight API server that provides:
      Random word selection from a dictionary; Word validation against the dictionary
      For production deployment, this functionality was moved to the client side to enable static hosting. 
    - PWA Implementation: The game is implemented as a Progressive Web App (PWA) with:
      Service worker for caching and offline play
      Web manifest for installation
      App icons at various resolutions
      Installation prompt for mobile and desktop
    - Game State Management: Local state management using React's useState and useEffect hooks with persistence through: LocalStorage for saving game progress; 
      Statistics tracking for win/loss records and guess distribution
    - Accessibility Features: The game includes several accessibility enhancements:
      ARIA attributes for screen readers
      Keyboard support for gameplay
      High contrast colors for visual accessibility
      Game state announcements for screen readers  
    - Dark Mode: A theme toggle allows switching between light and dark modes, with preferences saved in localStorage.

# Future Enhancements
    - Daily challenge mode
    - Shareable results
    - User accounts for cross-device progress    



