import { useState, useRef, useCallback } from 'react';

export interface AudioRecordingState {
  isRecording: boolean;
  isPlaying: boolean;
  audioUrl: string | null;
  audioBlob: Blob | null;
  duration: number;
  error: string | null;
}

export const useAudioRecording = () => {
  const [state, setState] = useState<AudioRecordingState>({
    isRecording: false,
    isPlaying: false,
    audioUrl: null,
    audioBlob: null,
    duration: 0,
    error: null
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      startTimeRef.current = Date.now();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        
        setState(prev => ({
          ...prev,
          audioUrl,
          audioBlob: blob,
          isRecording: false
        }));

        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      
      // Update duration every second
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setState(prev => ({ ...prev, duration: elapsed }));
      }, 1000);

      setState(prev => ({
        ...prev,
        isRecording: true,
        error: null,
        duration: 0
      }));

    } catch (error) {
      console.error('Error starting recording:', error);
      setState(prev => ({
        ...prev,
        error: 'Unable to access microphone. Please check permissions.'
      }));
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [state.isRecording]);

  const playRecording = useCallback(() => {
    if (state.audioUrl && !state.isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(state.audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setState(prev => ({ ...prev, isPlaying: false }));
      };
      
      audio.onerror = () => {
        setState(prev => ({ 
          ...prev, 
          isPlaying: false,
          error: 'Error playing audio'
        }));
      };
      
      audio.play().then(() => {
        setState(prev => ({ ...prev, isPlaying: true }));
      }).catch((error) => {
        console.error('Error playing audio:', error);
        setState(prev => ({ 
          ...prev, 
          error: 'Unable to play recording'
        }));
      });
    }
  }, [state.audioUrl, state.isPlaying]);

  const stopPlaying = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const clearRecording = useCallback(() => {
    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl);
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setState({
      isRecording: false,
      isPlaying: false,
      audioUrl: null,
      audioBlob: null,
      duration: 0,
      error: null
    });
  }, [state.audioUrl]);

  const formatDuration = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    playRecording,
    stopPlaying,
    clearRecording,
    formatDuration
  };
};