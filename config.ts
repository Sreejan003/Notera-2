
// ------------------------------------------------------------------
// IMPORTANT: API KEY CONFIGURATION
// ------------------------------------------------------------------
// To enable the AI features of Notera, you must provide your own
// Google Gemini API key.
//
// 1. Get your API key from Google AI Studio: https://aistudio.google.com/app/apikey
// 2. Replace the placeholder string 'YOUR_API_KEY_HERE' below with your actual key.
//
// Example:
// export const API_KEY = 'AbCdEfGhIjKlMnOpQrStUvWxYz_1234567890';
// ------------------------------------------------------------------

export const API_KEY = process.env.GEMINI_API_KEY as string;
