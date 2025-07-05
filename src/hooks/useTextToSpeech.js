// Enhanced Text-to-Speech with natural voice selection
import { useState, useEffect, useCallback } from 'react';

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      
      // Filter for more natural voices
      const naturalVoices = availableVoices.filter(voice => {
        const name = voice.name.toLowerCase();
        const lang = voice.lang.toLowerCase();
        
        // Prioritize natural-sounding voices
        return (
          // Google voices (usually better quality)
          name.includes('google') ||
          // Microsoft voices
          name.includes('microsoft') ||
          // Natural voices
          name.includes('natural') ||
          // Neural voices
          name.includes('neural') ||
          // Premium voices
          name.includes('premium') ||
          // Exclude obviously robotic voices
          (!name.includes('robot') && !name.includes('synthetic'))
        ) && (
          // Prefer English voices
          lang.startsWith('en') ||
          lang.startsWith('de') ||
          lang.startsWith('fr') ||
          lang.startsWith('es')
        );
      });

      // Sort voices by quality indicators
      const sortedVoices = naturalVoices.sort((a, b) => {
        const aScore = getVoiceQualityScore(a);
        const bScore = getVoiceQualityScore(b);
        return bScore - aScore;
      });

      setVoices(sortedVoices);
      
      // Auto-select the best voice
      if (sortedVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(sortedVoices[0]);
      }
    };

    loadVoices();
    
    // Reload voices when they change (some browsers load them asynchronously)
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [selectedVoice]);

  // Voice quality scoring function
  const getVoiceQualityScore = (voice) => {
    let score = 0;
    const name = voice.name.toLowerCase();
    
    // Bonus for premium indicators
    if (name.includes('google')) score += 50;
    if (name.includes('microsoft')) score += 40;
    if (name.includes('neural')) score += 30;
    if (name.includes('natural')) score += 25;
    if (name.includes('premium')) score += 20;
    if (name.includes('enhanced')) score += 15;
    
    // Bonus for female voices (often more pleasant)
    if (name.includes('female') || name.includes('woman') || name.includes('girl')) score += 10;
    
    // Bonus for specific good voices
    if (name.includes('samantha')) score += 30;
    if (name.includes('alex')) score += 25;
    if (name.includes('victoria')) score += 20;
    
    // Penalty for robotic indicators
    if (name.includes('robot')) score -= 50;
    if (name.includes('synthetic')) score -= 30;
    if (name.includes('default')) score -= 20;
    
    return score;
  };

  const speak = useCallback((text, options = {}) => {
    if (!text) return;

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Use selected voice or fallback to best available
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else if (voices.length > 0) {
      utterance.voice = voices[0];
    }
    
    // Set speech parameters
    utterance.rate = options.rate || rate;
    utterance.pitch = options.pitch || pitch;
    utterance.volume = options.volume || 1.0;
    
    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
    };
    
    // Start speaking
    speechSynthesis.speak(utterance);
  }, [selectedVoice, voices, rate, pitch]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  }, []);

  const pause = useCallback(() => {
    speechSynthesis.pause();
    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    speechSynthesis.resume();
    setIsPlaying(true);
  }, []);

  return {
    speak,
    stop,
    pause,
    resume,
    isPlaying,
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    pitch,
    setPitch
  };
};