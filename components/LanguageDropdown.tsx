import React, { useState, useRef, useEffect } from 'react';
import { GlobeIcon, ChevronDownIcon } from './Icons';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
];

interface LanguageDropdownProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  disabled?: boolean;
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ 
  selectedLanguage, 
  onLanguageChange, 
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLang = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (languageCode: string) => {
    onLanguageChange(languageCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-3 border rounded-lg transition-colors ${
          disabled 
            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
            : 'bg-white border-slate-300 text-slate-700 hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        }`}
      >
        <div className="flex items-center space-x-3">
          <GlobeIcon className="w-5 h-5 text-slate-500" />
          <div className="text-left">
            <p className="font-medium">{selectedLang.name}</p>
            <p className="text-sm text-slate-500">{selectedLang.nativeName}</p>
          </div>
        </div>
        <ChevronDownIcon 
          className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 ${
                selectedLanguage === language.code ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
              }`}
            >
              <div>
                <p className="font-medium">{language.name}</p>
                <p className="text-sm text-slate-500">{language.nativeName}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
