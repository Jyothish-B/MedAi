import React, { useState } from 'react';
import { generateMedAIDescription } from '../services/geminiService';

interface TextToSignLanguageProps {
  imageFile: File | null;
}

// Path to ASL images (now in public/asl_images/)
const ASL_IMAGE_PATH = '/asl_images/';
const ANIMATION_DELAY = 900; // 0.9 seconds delay for faster animation

const validChar = (char: string) => {
  return (
    (char >= 'a' && char <= 'z') || (char >= '0' && char <= '9')
  );
};

const tryExtensions = ['.jpeg', '.jpg', '.png'];

export default function TextToSignLanguage({ imageFile }: TextToSignLanguageProps) {
  const [extractedText, setExtractedText] = useState('');
  const [display, setDisplay] = useState<React.ReactNode>(null);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const animate = (text: string, idx: number) => {
    if (idx >= text.length) {
      setAnimating(false);
      return;
    }
    const char = text[idx].toLowerCase();
    if (validChar(char)) {
      const src = `${ASL_IMAGE_PATH}${char}.jpeg`;
      console.log('Loading ASL image:', src); // Debug log
      const imgNode = (
        <div key={`${char}-${idx}`} className="flex flex-col items-center">
          <img
            src={src}
            alt={`ASL sign for ${char}`}
            className="w-32 h-40 object-contain rounded-lg border-2 border-blue-100 bg-blue-50 mx-auto"
            onLoad={() => console.log('Image loaded successfully:', src)}
            onError={(e) => {
              console.error('Image failed to load:', src);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span className="mt-2 text-lg font-bold text-blue-600">{char.toUpperCase()}</span>
        </div>
      );
      setDisplay(imgNode);
    } else if (char === ' ') {
      setDisplay(<span className="text-2xl font-bold text-gray-400">SPACE</span>);
    } else {
      setDisplay(<span className="text-lg text-gray-500">{char}</span>);
    }
    setTimeout(() => animate(text, idx + 1), ANIMATION_DELAY);
  };



  const handleExtractAndAnimate = async () => {
    if (!imageFile) {
      setError('Please upload a prescription image first.');
      return;
    }
    setLoading(true);
    setError('');
    setExtractedText('');
    setDisplay(null);
    try {
      // Use Gemini API to extract text from prescription image
      const result = await generateMedAIDescription('Extract prescription text only. Output only the prescription text, nothing else.', imageFile);
      // Use only the first line or a reasonable chunk for animation
      const text = result.split('\n')[0].slice(0, 30);
      setExtractedText(text);
      setAnimating(true);
      animate(text, 0);
    } catch (err) {
      setError('Failed to extract text from image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={handleExtractAndAnimate}
        className="mt-2 w-full flex items-center justify-center gap-2 bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-purple-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100"
        disabled={!imageFile || loading || animating}
      >
        {loading ? 'Extracting...' : 'Prescription → Sign Language'}
      </button>
      
      {/* Test button for quick testing */}
      <button
        onClick={() => {
          const testText = "hello";
          setExtractedText(testText);
          setAnimating(true);
          animate(testText, 0);
        }}
        className="mt-2 w-full flex items-center justify-center gap-2 bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200"
        disabled={loading || animating}
      >
        🧪 Test with "HELLO"
      </button>
      
      {error && <div className="text-red-500 mb-2 mt-2">{error}</div>}
      {extractedText && (
        <div className="mb-2 mt-2 text-slate-600">Extracted: <span className="font-mono">{extractedText}</span></div>
      )}
      <div className="mt-8 min-h-[200px] flex items-center justify-center text-2xl min-w-[120px] bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
        {display || <span className="text-slate-400">ASL signs will appear here</span>}
      </div>
    </div>
  );
}
