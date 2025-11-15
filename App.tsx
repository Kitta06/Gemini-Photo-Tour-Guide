
import React, { useState, useCallback, useRef } from 'react';
import { analyzeImage, fetchLandmarkHistory, generateSpeech } from './services/geminiService';
import type { AppState, Source } from './types';
import { playAudio } from './utils/audioUtils';

import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import Loader from './components/Loader';
import { LogoIcon } from './components/icons';

export default function App() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [landmarkName, setLandmarkName] = useState<string>('');
  const [historyText, setHistoryText] = useState<string>('');
  const [sources, setSources] = useState<Source[]>([]);
  const [audioData, setAudioData] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    setAppState('loading');
    setErrorMessage('');
    resetResults();

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = (reader.result as string).split(',')[1];
      setImageUrl(reader.result as string);

      try {
        // Step 1: Analyze Image
        setAppState('analyzing');
        const landmark = await analyzeImage(base64Image);
        setLandmarkName(landmark);

        // Step 2: Fetch History
        setAppState('searching');
        const { text, sources: groundingSources } = await fetchLandmarkHistory(landmark);
        setHistoryText(text);
        setSources(groundingSources);

        // Step 3: Generate Speech
        setAppState('narrating');
        const speechData = await generateSpeech(text);
        setAudioData(speechData);

        setAppState('success');
      } catch (error) {
        console.error("An error occurred during the process:", error);
        setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred. Please try again.");
        setAppState('error');
      }
    };
    reader.onerror = () => {
      setErrorMessage("Failed to read the image file.");
      setAppState('error');
    };
  }, []);
  
  const handlePlayAudio = useCallback(async () => {
    if (!audioData) return;
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
    }
    const source = await playAudio(audioData, audioContextRef.current);
    audioSourceRef.current = source;
  }, [audioData]);


  const resetResults = () => {
    setImageUrl(null);
    setLandmarkName('');
    setHistoryText('');
    setSources([]);
    setAudioData('');
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    }
  };

  const handleStartOver = () => {
    resetResults();
    setErrorMessage('');
    setAppState('idle');
  };

  const isLoading = ['loading', 'analyzing', 'searching', 'narrating'].includes(appState);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-4xl text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <LogoIcon />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-teal-300 text-transparent bg-clip-text">
            Gemini Photo Tour Guide
          </h1>
        </div>
        <p className="text-lg text-gray-400">
          Upload a landmark photo and get an AI-powered historical tour with narration.
        </p>
      </header>

      <main className="w-full max-w-4xl flex-grow">
        {appState === 'idle' && (
          <ImageUploader onImageUpload={handleImageUpload} disabled={isLoading} />
        )}

        {isLoading && <Loader state={appState} />}

        {appState === 'error' && (
          <div className="text-center p-8 bg-gray-800 rounded-lg">
            <h2 className="text-2xl font-bold text-red-500 mb-4">An Error Occurred</h2>
            <p className="text-gray-300 mb-6">{errorMessage}</p>
            <button
              onClick={handleStartOver}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {appState === 'success' && imageUrl && (
          <ResultDisplay
            imageUrl={imageUrl}
            landmarkName={landmarkName}
            historyText={historyText}
            sources={sources}
            onPlayAudio={handlePlayAudio}
            onStartOver={handleStartOver}
            hasAudio={!!audioData}
          />
        )}
      </main>
      
      <footer className="w-full max-w-4xl text-center mt-12 text-gray-500 text-sm">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
}
