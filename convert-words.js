// convert-words.js - ES Module version
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the text file - adjust the path to your actual file location
const filePath = path.join(__dirname, 'src', 'server', 'data', 'six-letter-words.txt');
const text = fs.readFileSync(filePath, 'utf8');

// Split by newlines and filter out any empty lines
const words = text.split('\n')
  .map(word => word.trim().toUpperCase())
  .filter(word => word.length > 0);

// Create the JSON array
const jsonContent = JSON.stringify(words, null, 2);

// Write to a new file in public directory
const outputPath = path.join(__dirname, 'public', 'words.json');
fs.writeFileSync(outputPath, jsonContent);

console.log(`Converted ${words.length} words to JSON format`);
console.log(`Saved to: ${outputPath}`);