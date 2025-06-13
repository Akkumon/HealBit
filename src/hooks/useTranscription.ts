import { useState, useCallback, useRef } from 'react';

export interface TranscriptionState {
  isProcessing: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
}

const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.continuous = true; // Keep listening
  recognition.interimResults = true; // Get results while speaking
}

export const useTranscription = () => {
  const [state, setState] = useState<TranscriptionState>({
    isProcessing: false,
    transcript: '',
    confidence: 0,
    error: null
  });

  const isMounted = useRef(true);

  // Cleanup on unmount
  // useEffect(() => {
  //   return () => {
  //     isMounted.current = false;
  //     if (recognition) {
  //       recognition.stop();
  //     }
  //   };
  // }, []);

  const startListening = useCallback(() => {
    if (!recognition) {
      setState(prev => ({ ...prev, error: 'Speech recognition not supported in this browser.' }));
      return;
    }

    setState(prev => ({ ...prev, isProcessing: true, transcript: '', error: null }));

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptSegment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptSegment;
        } else {
          interimTranscript += transcriptSegment;
        }
      }

      if (isMounted.current) {
        setState(prev => ({
          ...prev,
          transcript: finalTranscript + interimTranscript,
          confidence: event.results[event.results.length - 1][0].confidence || 0
        }));
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (isMounted.current) {
        setState(prev => ({ ...prev, error: `Speech recognition error: ${event.error}` }));
        console.error('Speech recognition error:', event);
      }
    };

    recognition.onend = () => {
      if (isMounted.current && state.isProcessing) {
        // If processing is still true, it means recognition stopped unexpectedly
        setState(prev => ({ ...prev, isProcessing: false }));
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Error starting speech recognition:", e);
      setState(prev => ({ ...prev, isProcessing: false, error: 'Error starting speech recognition.' }));
    }
  }, [state.isProcessing]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
    setState(prev => ({ ...prev, isProcessing: false }));
  }, []);

  const generateTranscript = useCallback(async (duration: number): Promise<string> => {
    // This function will now simply return the current final transcript
    // as live transcription is happening via startListening/stopListening
    return state.transcript;
  }, [state.transcript]);

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
    clearTranscript,
    startListening,
    stopListening
  };
};
