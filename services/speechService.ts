/**
 * Speech Service for Medical Prescription Assistant
 * Handles Speech Recognition (ASR) and Text-to-Speech (TTS)
 * Optimized for medical terminology
 */

export interface SpeechResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface SpeechConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
}

export class MedicalSpeechService {
  private recognition: any = null;
  private synthesis: SpeechSynthesis;
  private isListening: boolean = false;
  private medicalTerms: string[] = [
    // Common medical terms for better recognition
    'prescription', 'medication', 'dosage', 'tablet', 'capsule', 'syrup',
    'morning', 'evening', 'breakfast', 'dinner', 'before meals', 'after meals',
    'milligram', 'mg', 'ml', 'milliliter', 'twice daily', 'three times',
    'paracetamol', 'ibuprofen', 'aspirin', 'antibiotic', 'vitamin',
    'blood pressure', 'diabetes', 'cholesterol', 'pain relief',
    'side effects', 'allergic reaction', 'doctor', 'pharmacy'
  ];

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      
      // Configure for medical terminology
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 3;
      this.recognition.lang = 'en-US';
      
      // Set grammar hints for medical terms (if supported)
      try {
        const SpeechGrammarList = (window as any).SpeechGrammarList || (window as any).webkitSpeechGrammarList;
        if (SpeechGrammarList) {
          const grammarList = new SpeechGrammarList();
          const grammar = `#JSGF V1.0; grammar medical; public <medical> = ${this.medicalTerms.join(' | ')};`;
          grammarList.addFromString(grammar, 1);
          this.recognition.grammars = grammarList;
        }
      } catch (error) {
        console.log('Speech grammar not supported, using default recognition');
      }
    }
  }

  /**
   * Check if speech recognition is supported
   */
  public isSpeechRecognitionSupported(): boolean {
    return this.recognition !== null;
  }

  /**
   * Check if text-to-speech is supported
   */
  public isTextToSpeechSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  /**
   * Start speech recognition
   */
  public startListening(
    onResult: (result: SpeechResult) => void,
    onError: (error: string) => void,
    config: Partial<SpeechConfig> = {}
  ): void {
    if (!this.recognition) {
      onError('Speech recognition is not supported in this browser');
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    // Apply configuration
    this.recognition.continuous = config.continuous ?? true;
    this.recognition.interimResults = config.interimResults ?? true;
    this.recognition.maxAlternatives = config.maxAlternatives ?? 3;
    this.recognition.lang = config.language ?? 'en-US';

    this.recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;
        
        // Enhance medical term recognition
        const enhancedTranscript = this.enhanceMedicalTerms(transcript);
        
        onResult({
          transcript: enhancedTranscript,
          confidence: confidence,
          isFinal: result.isFinal
        });
      }
    };

    this.recognition.onerror = (event: any) => {
      let errorMessage = 'Speech recognition error';
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try speaking again.';
          break;
        case 'audio-capture':
          errorMessage = 'Microphone not accessible. Please check permissions.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage = 'Network error occurred during speech recognition.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }
      onError(errorMessage);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    try {
      this.recognition.start();
    } catch (error) {
      onError('Failed to start speech recognition');
      this.isListening = false;
    }
  }

  /**
   * Stop speech recognition
   */
  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Check if currently listening
   */
  public getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Convert text to speech with medical-optimized voice
   */
  public speak(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      volume?: number;
      lang?: string;
      voiceName?: string;
    } = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isTextToSpeechSupported()) {
        reject(new Error('Text-to-speech is not supported in this browser'));
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice for medical content
      utterance.rate = options.rate ?? 0.85; // Slightly slower for medical terms
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 0.8;
      utterance.lang = options.lang ?? 'en-US';

      // Try to select a clear, professional voice
      const voices = this.synthesis.getVoices();
      if (voices.length > 0) {
        let selectedVoice = voices.find(voice => 
          voice.name.includes(options.voiceName || '') ||
          voice.name.includes('Google') ||
          voice.name.includes('Microsoft') ||
          voice.name.includes('Enhanced')
        );
        
        if (!selectedVoice) {
          // Prefer female voices for medical content (often clearer)
          selectedVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('female') ||
            voice.name.toLowerCase().includes('zira') ||
            voice.name.toLowerCase().includes('susan')
          );
        }
        
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
        }
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => {
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      this.synthesis.speak(utterance);
    });
  }

  /**
   * Stop current speech synthesis
   */
  public stopSpeaking(): void {
    this.synthesis.cancel();
  }

  /**
   * Get available voices for selection
   */
  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices();
  }

  /**
   * Enhance transcript with better medical term recognition
   */
  private enhanceMedicalTerms(transcript: string): string {
    let enhanced = transcript.toLowerCase();
    
    // Common medical term corrections
    const corrections: { [key: string]: string } = {
      'para citamol': 'paracetamol',
      'para acetamol': 'paracetamol',
      'ibu profen': 'ibuprofen',
      'anti biotic': 'antibiotic',
      'milli gram': 'milligram',
      'milli liter': 'milliliter',
      'twice a day': 'twice daily',
      'three times a day': 'three times daily',
      'before meal': 'before meals',
      'after meal': 'after meals',
      'side effect': 'side effects',
      'blood sugar': 'blood glucose',
      'bp': 'blood pressure'
    };

    Object.entries(corrections).forEach(([wrong, correct]) => {
      enhanced = enhanced.replace(new RegExp(wrong, 'gi'), correct);
    });

    // Restore original casing for first letter
    return enhanced.charAt(0).toUpperCase() + enhanced.slice(1);
  }

  /**
   * Create audio-optimized medical description
   */
  public createAudioFriendlyResponse(text: string): string {
    let audioText = text;
    
    // Replace abbreviations with full words for better pronunciation
    const abbreviations: { [key: string]: string } = {
      'mg': 'milligrams',
      'ml': 'milliliters',
      'tab': 'tablet',
      'tabs': 'tablets',
      'cap': 'capsule',
      'caps': 'capsules',
      'bd': 'twice daily',
      'od': 'once daily',
      'tid': 'three times daily',
      'qid': 'four times daily',
      'prn': 'as needed',
      'ac': 'before meals',
      'pc': 'after meals',
      'hs': 'at bedtime'
    };

    Object.entries(abbreviations).forEach(([abbr, full]) => {
      audioText = audioText.replace(new RegExp(`\\b${abbr}\\b`, 'gi'), full);
    });

    // Add pauses for better listening experience
    audioText = audioText.replace(/\./g, '. ');
    audioText = audioText.replace(/,/g, ', ');
    audioText = audioText.replace(/:/g, ': ');
    
    // Remove markdown formatting for audio
    audioText = audioText.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove markdown bold
    audioText = audioText.replace(/\*(.*?)\*/g, '$1'); // Remove markdown italic
    audioText = audioText.replace(/#{1,6}\s/g, ''); // Remove markdown headers
    
    return audioText;
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    this.stopListening();
    this.stopSpeaking();
  }
}

// Global speech service instance
export const speechService = new MedicalSpeechService();
