
import React from 'react';

const ApiKeyInstructions: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-surface dark:bg-dark-bg flex items-center justify-center p-6 text-center">
      <div className="max-w-3xl w-full bg-white dark:bg-dark-card rounded-[3rem] shadow-2xl p-16 border border-brand-tertiary/10 dark:border-dark-border">
        <div className="w-24 h-24 bg-rose-100 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 rounded-3xl flex items-center justify-center mx-auto mb-8 text-4xl">
          <i className="fa-solid fa-key"></i>
        </div>
        <h1 className="text-4xl font-black text-brand-primary dark:text-white tracking-tight mb-4">API Key Required</h1>
        <p className="text-brand-tertiary font-medium text-lg max-w-xl mx-auto leading-relaxed mb-10">
          To activate the AI-powered features of Notera, you need to set up your Google Gemini API key.
        </p>
        
        <div className="text-left bg-brand-surface dark:bg-dark-bg p-8 rounded-2xl border border-brand-tertiary/20 dark:border-dark-border">
          <h2 className="font-bold text-brand-primary dark:text-white text-lg mb-4">Follow these steps:</h2>
          <ol className="list-decimal list-inside space-y-4 font-medium text-slate-600 dark:text-slate-300">
            <li>
              In your project's file explorer, find and open the file named <code className="bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-secondary dark:text-brand-tertiary font-bold px-2 py-1 rounded-md mx-1">config.ts</code>.
            </li>
            <li>
              Inside that file, replace the placeholder text <code className="bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-secondary dark:text-brand-tertiary font-bold px-2 py-1 rounded-md mx-1">'YOUR_API_KEY_HERE'</code> with your actual Gemini API key.
            </li>
            <li>
              Save the file. The application will automatically reload once the key is detected.
            </li>
          </ol>
        </div>
        
        <a 
          href="https://aistudio.google.com/app/apikey" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block mt-10 bg-brand-primary text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:bg-brand-secondary transition-all"
        >
          Get your API Key from Google AI Studio
          <i className="fa-solid fa-arrow-up-right-from-square text-xs ml-3"></i>
        </a>
      </div>
    </div>
  );
};

export default ApiKeyInstructions;
