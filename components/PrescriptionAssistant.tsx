import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ImageUploader } from './ImageUploader';
import { ResponseDisplay } from './ResponseDisplay';
import { LanguageDropdown } from './LanguageDropdown';
import { SpeechAssistant } from './SpeechAssistant';
import { MedkitIcon, SparklesIcon, TranslateIcon } from './Icons';
import { generateMedAIDescription, generateSpeechOptimizedAnalysis, translatePrescription } from '../services/geminiService';
import TextToSignLanguage from './TextToSignLanguage';

const PrescriptionAssistant: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('Explain this prescription to me.');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isTriggeredBySpeech, setIsTriggeredBySpeech] = useState<boolean>(false);

  // Handle speech input
  const handleSpeechResult = useCallback((transcript: string) => {
    // Update the prompt with speech input
    setPrompt(transcript);
    
    // Auto-trigger analysis if we have an image and the transcript seems complete
    if (imageFile && transcript.length > 10) {
      // Check if it's a translation request
      const isTranslationRequest = transcript.toLowerCase().includes('translate') || 
                                   transcript.toLowerCase().includes('hindi') || 
                                   transcript.toLowerCase().includes('tamil') || 
                                   transcript.toLowerCase().includes('telugu');
      
      if (isTranslationRequest) {
        // Extract language if mentioned
        const languageMap: { [key: string]: string } = {
          'hindi': 'hi',
          'tamil': 'ta',
          'telugu': 'te',
          'bengali': 'bn',
          'marathi': 'mr',
          'gujarati': 'gu',
          'kannada': 'kn',
          'malayalam': 'ml',
          'punjabi': 'pa',
          'urdu': 'ur'
        };
        
        for (const [lang, code] of Object.entries(languageMap)) {
          if (transcript.toLowerCase().includes(lang)) {
            setSelectedLanguage(code);
            // Auto-translate will be triggered by useEffect when language changes
            break;
          }
        }
      } else {
        // Regular analysis - trigger after a short delay
        setIsTriggeredBySpeech(true);
        setTimeout(() => {
          handleSubmit();
        }, 1000);
      }
    }
  }, [imageFile]);

  const handleSubmit = useCallback(async () => {
    if (!imageFile) {
      setError('Please upload an image of the prescription.');
      return;
    }
    if (!prompt) {
      setError('Please provide a prompt or question.');
      return;
    }

    setError('');
    setIsLoading(true);
    setResponse('');

    try {
      // Use speech-optimized analysis if triggered by speech input
      const result = isTriggeredBySpeech 
        ? await generateSpeechOptimizedAnalysis(prompt, imageFile)
        : await generateMedAIDescription(prompt, imageFile);
      setResponse(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to analyze prescription: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setIsTriggeredBySpeech(false); // Reset speech trigger flag
    }
  }, [imageFile, prompt, isTriggeredBySpeech]);

  const handleTranslate = useCallback(async () => {
    if (!imageFile) {
      setError('Please upload an image of the prescription first.');
      return;
    }
    if (selectedLanguage === 'en') {
      setError('Please select a different language for translation.');
      return;
    }

    setError('');
    setIsTranslating(true);
    setResponse('');

    try {
      const languageNames: { [key: string]: string } = {
        'hi': 'Hindi',
        'ta': 'Tamil',
        'te': 'Telugu',
        'bn': 'Bengali',
        'mr': 'Marathi',
        'gu': 'Gujarati',
        'kn': 'Kannada',
        'ml': 'Malayalam',
        'pa': 'Punjabi',
        'ur': 'Urdu',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'pt': 'Portuguese',
        'ar': 'Arabic',
        'zh': 'Chinese',
        'ja': 'Japanese',
        'ko': 'Korean',
        'ru': 'Russian',
      };

      const languageName = languageNames[selectedLanguage] || selectedLanguage;
      const result = await translatePrescription(imageFile, languageName);
      setResponse(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to translate prescription: ${errorMessage}`);
    } finally {
      setIsTranslating(false);
    }
  }, [imageFile, selectedLanguage]);

  return (
    <div className="min-h-screen font-sans text-slate-800 flex flex-col items-center p-4 sm:p-6 md:p-8 bg-slate-50">
      {/* Navigation */}
      <nav className="w-full max-w-6xl mb-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <MedkitIcon className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-slate-800">
            Med<span className="text-blue-600">AI</span>
          </span>
        </Link>
        <Link
          to="/"
          className="text-slate-600 hover:text-slate-800 px-4 py-2 rounded-lg hover:bg-white transition-all"
        >
          ← Back to Home
        </Link>
      </nav>

      {/* Header */}
      <header className="w-full max-w-6xl mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
          MedAI <span className="text-blue-600">Prescription Assistant</span>
        </h1>
        <p className="text-slate-600 mt-2">Upload your prescription and get instant AI-powered explanations</p>
      </header>

      <main className="w-full max-w-6xl flex-grow">
        {/* Speech Assistant */}
        <SpeechAssistant
          onSpeechResult={handleSpeechResult}
          responseText={response}
          isEnabled={true}
          language={selectedLanguage === 'en' ? 'en-US' : selectedLanguage}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">1. Upload Prescription</h2>
            <ImageUploader onImageChange={setImageFile} />
            
            <h2 className="text-xl font-semibold text-slate-700 mt-6 mb-4">2. Choose Analysis Type</h2>
            
            {/* Analysis Options */}
            <div className="space-y-4">
              {/* Regular Analysis */}
              <div className="border border-slate-200 rounded-lg p-4">
                <h3 className="font-medium text-slate-700 mb-3">📋 Regular Analysis</h3>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Explain this prescription to me, what are the side effects?"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none h-20 text-sm"
                />
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || isTranslating || !imageFile}
                  className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100"
                >
                  <SparklesIcon className="w-5 h-5" />
                  {isLoading ? 'Analyzing...' : 'Analyze Prescription'}
                </button>
              </div>

              {/* Translation */}
              <div className="border border-slate-200 rounded-lg p-4">
                <h3 className="font-medium text-slate-700 mb-3">🌍 Translation</h3>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select Language for Translation:
                  </label>
                  <LanguageDropdown
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={setSelectedLanguage}
                    disabled={isLoading || isTranslating}
                  />
                </div>
                <button
                  onClick={handleTranslate}
                  disabled={isLoading || isTranslating || !imageFile || selectedLanguage === 'en'}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100"
                >
                  <TranslateIcon className="w-5 h-5" />
                  {isTranslating ? 'Translating...' : 'Translate Prescription'}
                </button>
                {selectedLanguage === 'en' && (
                  <p className="text-xs text-slate-500 mt-1">
                    Please select a different language for translation
                  </p>
                )}
              </div>

              {/* Sign Language Animation */}
              <div className="border border-slate-200 rounded-lg p-4">
                <h3 className="font-medium text-slate-700 mb-3">🤟 Prescription to Sign Language</h3>
                <TextToSignLanguage imageFile={imageFile} />
              </div>
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80 min-h-[300px] lg:min-h-0">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">
              {isTranslating ? 'AI Translation' : 'AI Interpretation'}
            </h2>
            <ResponseDisplay
              response={response}
              isLoading={isLoading || isTranslating}
              error={error}
            />
          </div>
        </div>
      </main>

      <footer className="w-full max-w-6xl text-center text-slate-500 text-xs mt-8">
        <p>&copy; {new Date().getFullYear()} MedAI. For informational purposes only.</p>
      </footer>
    </div>
  );
};

export default PrescriptionAssistant;
