import React from 'react';
import type { AppState } from '../types';
import { SearchIcon, AnalyzeIcon, NarrateIcon } from './icons';

interface LoaderProps {
  state: AppState;
}

// Fix: Use React.ReactElement instead of JSX.Element to avoid namespace error.
const loadingMessages: Record<string, { message: string; icon: React.ReactElement }> = {
  loading: { message: 'Preparing your request...', icon: <AnalyzeIcon /> },
  analyzing: { message: 'Analyzing your photo...', icon: <AnalyzeIcon /> },
  searching: { message: 'Researching the landmark...', icon: <SearchIcon /> },
  narrating: { message: 'Creating your audio tour...', icon: <NarrateIcon /> },
};

const Loader: React.FC<LoaderProps> = ({ state }) => {
  const { message, icon } = loadingMessages[state] || loadingMessages.loading;

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-gray-800 rounded-2xl animate-fade-in">
      <div className="animate-spin text-blue-400 mb-4">
        {icon}
      </div>
      <p className="text-xl font-semibold text-gray-300">{message}</p>
    </div>
  );
};

export default Loader;