
import { useState, useCallback } from 'react';

export interface TranscriptionState {
  isProcessing: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
}

const mockTranscripts = [
  "I'm feeling overwhelmed today, but I'm trying to take things one step at a time.",
  "Today was challenging, but I noticed some small moments of peace.",
  "I'm grateful for the support I have, even when it's hard to see.",
  "Sometimes I feel like I'm not making progress, but I know healing takes time.",
  "I had a good moment today where I felt hopeful about the future.",
  "It's okay to not be okay. I'm learning to be gentle with myself.",
  "I'm proud of myself for taking time to reflect today."
];

export const useTranscription = () => {
  const [state, setState] = useState<TranscriptionState>({
    isProcessing: false,
    transcript: '',
    confidence: 0,
    error: null
  });

  const generateTranscript = useCallback(async (duration: number): Promise<string> => {
    setState(prev => ({ ...prev, isProcessing: true, error: null }));
    
    try {
      // Simulate processing time based on duration
      const processingTime = Math.min(duration * 100, 3000); // Max 3 seconds
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      // Select transcript based on duration
      const transcriptIndex = Math.floor(duration / 10) % mockTranscripts.length;
      const baseTranscript = mockTranscripts[transcriptIndex];
      
      // Simulate confidence based on duration (longer recordings = higher confidence)
      const confidence = Math.min(0.7 + (duration / 60) * 0.25, 0.95);
      
      setState(prev => ({
        ...prev,
        isProcessing: false,
        transcript: baseTranscript,
        confidence
      }));
      
      return baseTranscript;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: 'Failed to generate transcript'
      }));
      throw error;
    }
  }, []);

  const updateTranscript = useCallback((newTranscript: string) => {
    setState(prev => ({
      ...prev,
      transcript: newTranscript,
      confidence: 1.0 // User edited = 100% confidence
    }));
  }, []);

  const clearTranscript = useCallback(() => {
    setState({
      isProcessing: false,
      transcript: '',
      confidence: 0,
      error: null
    });
  }, []);

  return {
    ...state,
    generateTranscript,
    updateTranscript,
    clearTranscript
  };
};
