import React from 'react';

type FileInputPairProps = {
  onAudioFileChange: (file: File | null) => void;
  onTranscriptionFileChange: (file: File | null) => void;
};

const FileInputPair: React.FC<FileInputPairProps> = ({ onAudioFileChange, onTranscriptionFileChange }) => {
  return (
    <div className="flex flex-row gap-4 p-4 border border-gray-200 rounded-lg">
      <div className="flex flex-col flex-1">
        <label htmlFor="audio-input" className="sr-only">Choose audio file</label>
        <input
          type="file"
          accept=".mp3,.wav"
          id="audio-input"
          className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 file:bg-gray-50 file:border-0 file:bg-gray-100 file:me-4 file:py-3 file:px-4 dark:file:bg-gray-700 dark:file:text-gray-400"
          onChange={(e) => onAudioFileChange(e.target.files ? e.target.files[0] : null)}
        />
      </div>
      <div className="flex flex-col flex-1">
        <label htmlFor="transcription-input" className="sr-only">Choose transcription file</label>
        <input
          type="file"
          accept=".txt"
          id="transcription-input"
          className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 file:bg-gray-50 file:border-0 file:bg-gray-100 file:me-4 file:py-3 file:px-4 dark:file:bg-gray-700 dark:file:text-gray-400"
          onChange={(e) => onTranscriptionFileChange(e.target.files ? e.target.files[0] : null)}
        />
      </div>
    </div>
  );
};

export default FileInputPair;
