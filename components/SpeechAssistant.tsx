import React, { useState, useEffect, useCallback } from 'react';
import { speechService, SpeechResult } from '../services/speechService';
import { MicrophoneIcon, MicrophoneSlashIcon, SpeakerWaveIcon, SpeakerXMarkIcon, PlayIcon, StopIcon } from './Icons';

interface SpeechAssistantProps {
  onSpeechResult: (transcript: string) => void;
  responseText: string;
  isEnabled?: boolean;
  language?: string;
}

export const SpeechAssistant: React.FC<SpeechAssistantProps> = ({
  onSpeechResult,
  responseText,
  isEnabled = true,
  language = 'en-US'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState('');
  const [speechSupported, setSpeechSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);

  // Check browser support on component mount
  useEffect(() => {
    setSpeechSupported(speechService.isSpeechRecognitionSupported());
    setTtsSupported(speechService.isTextToSpeechSupported());
  }, []);

  // Handle speech recognition results
  const handleSpeechResult = useCallback((result: SpeechResult) => {
    setTranscript(result.transcript);
    setConfidence(result.confidence);
    
    if (result.isFinal) {
      onSpeechResult(result.transcript);
      setTranscript('');
      setConfidence(0);
    }
  }, [onSpeechResult]);

  // Handle speech recognition errors
  const handleSpeechError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setIsListening(false);
    setTimeout(() => setError(''), 5000);
  }, []);

  // Start speech recognition
  const startListening = useCallback(() => {
    if (!speechSupported || !isEnabled) return;
    
    setError('');
    setTranscript('');
    setConfidence(0);
    
    speechService.startListening(
      handleSpeechResult,
      handleSpeechError,
      {
        language,
        continuous: false,
        interimResults: true,
        maxAlternatives: 1
      }
    );
    
    setIsListening(true);
  }, [speechSupported, isEnabled, language, handleSpeechResult, handleSpeechError]);

  // Stop speech recognition
  const stopListening = useCallback(() => {
    speechService.stopListening();
    setIsListening(false);
    setTranscript('');
    setConfidence(0);
  }, []);

  // Start text-to-speech
  const startSpeaking = useCallback(async () => {
    if (!ttsSupported || !responseText || !isEnabled) return;
    
    setIsSpeaking(true);
    setError('');
    
    try {
      const audioFriendlyText = speechService.createAudioFriendlyResponse(responseText);
      await speechService.speak(audioFriendlyText, {
        lang: language,
        rate: 0.85,
        pitch: 1.0,
        volume: 0.8
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Speech synthesis failed');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsSpeaking(false);
    }
  }, [ttsSupported, responseText, isEnabled, language]);

  // Stop text-to-speech
  const stopSpeaking = useCallback(() => {
    speechService.stopSpeaking();
    setIsSpeaking(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      speechService.destroy();
    };
  }, []);

  if (!speechSupported && !ttsSupported) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
        <p className="text-amber-800 text-sm">
          🎤 Speech features are not supported in this browser. Please use Chrome, Edge, or Safari for the best experience.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
          🎤 Voice Assistant
          {!isEnabled && <span className="text-sm text-gray-500">(Disabled)</span>}
        </h3>
        
        {error && (
          <div className="bg-red-100 border border-red-300 rounded-lg px-3 py-2">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Speech Recognition */}
        {speechSupported && (
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <h4 className="font-medium text-purple-700 mb-3 flex items-center gap-2">
              🗣️ Speech Input
            </h4>
            
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={!isEnabled}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-purple-500 hover:bg-purple-600 text-white disabled:bg-gray-400'
                }`}
              >
                {isListening ? (
                  <>
                    <MicrophoneSlashIcon className="w-4 h-4" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <MicrophoneIcon className="w-4 h-4" />
                    Start Listening
                  </>
                )}
              </button>
              
              {isListening && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-purple-600">Listening...</span>
                </div>
              )}
            </div>

            {transcript && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-2">
                <p className="text-purple-800 text-sm">
                  <strong>Transcribing:</strong> {transcript}
                </p>
                {confidence > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-purple-600">Confidence:</span>
                      <div className="flex-1 bg-purple-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all"
                          style={{ width: `${confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-purple-600">{Math.round(confidence * 100)}%</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <p className="text-xs text-gray-600">
              💡 Try saying: "Explain this prescription", "What are the side effects?", "Translate to Hindi"
            </p>
          </div>
        )}

        {/* Text-to-Speech */}
        {ttsSupported && (
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-blue-700 mb-3 flex items-center gap-2">
              🔊 Audio Response
            </h4>
            
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={isSpeaking ? stopSpeaking : startSpeaking}
                disabled={!isEnabled || !responseText}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isSpeaking
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <SpeakerXMarkIcon className="w-4 h-4" />
                    Stop Speaking
                  </>
                ) : (
                  <>
                    <SpeakerWaveIcon className="w-4 h-4" />
                    {responseText ? 'Read Response' : 'No Response'}
                  </>
                )}
              </button>
              
              {isSpeaking && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-blue-600">Speaking...</span>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-sm">
                {responseText ? (
                  <>
                    <strong>Ready to read:</strong> {responseText.slice(0, 100)}
                    {responseText.length > 100 && '...'}
                  </>
                ) : (
                  <em>No response text available for audio playback</em>
                )}
              </p>
            </div>

            <p className="text-xs text-gray-600 mt-2">
              🎧 Audio will be optimized for medical terminology pronunciation
            </p>
          </div>
        )}
      </div>

      {/* Speech Features Info */}
      <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="font-medium text-gray-700 mb-2">✨ Speech Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${speechSupported ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>Speech Recognition</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${ttsSupported ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>Text-to-Speech</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>Medical Terminology</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechAssistant;
