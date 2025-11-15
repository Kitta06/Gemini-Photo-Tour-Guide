
import React from 'react';
import type { Source } from '../types';
import { PlayIcon, RedoIcon, LinkIcon } from './icons';

interface ResultDisplayProps {
  imageUrl: string;
  landmarkName: string;
  historyText: string;
  sources: Source[];
  onPlayAudio: () => void;
  onStartOver: () => void;
  hasAudio: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  imageUrl,
  landmarkName,
  historyText,
  sources,
  onPlayAudio,
  onStartOver,
  hasAudio
}) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="p-6 sm:p-8 flex flex-col">
          <h2 className="text-3xl font-bold mb-4 text-teal-300">{landmarkName}</h2>
          <div className="prose prose-invert max-w-none text-gray-300 overflow-y-auto h-64 lg:h-auto lg:flex-grow pr-4">
            {historyText.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>

          {sources.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-400 mb-2">Sources:</h3>
              <ul className="space-y-2">
                {sources.map((source, index) => source.web && (
                  <li key={index}>
                    <a
                      href={source.web.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 hover:underline transition-colors text-sm"
                    >
                      <LinkIcon />
                      <span>{source.web.title || new URL(source.web.uri).hostname}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-700 flex items-center gap-4">
            {hasAudio && (
                <button
                    onClick={onPlayAudio}
                    className="flex-grow flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold transition-transform transform hover:scale-105"
                >
                    <PlayIcon />
                    Play Narration
                </button>
            )}
            <button
              onClick={onStartOver}
              title="Start Over"
              className="p-3 bg-gray-700 hover:bg-gray-600 rounded-md font-semibold transition-colors"
            >
              <RedoIcon />
            </button>
          </div>
        </div>
        <div className="relative min-h-[300px] lg:min-h-0">
          <img
            src={imageUrl}
            alt={landmarkName}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
