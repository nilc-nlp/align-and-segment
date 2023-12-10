import React from 'react';
import { FileType, StatusType } from '@/types'; // Update with the correct path
import FilePicker from '@/components/FilePicker';
import Status from '@/components/Status';
import { MdDelete } from 'react-icons/md';

interface FileRowProps {
    onDelete: () => void;
    handleAudioFileChange: (file: File) => void;
    handleTranscriptionFileChange: (file: File) => void;
    status?: StatusType;
}

const FileRow: React.FC<FileRowProps> = ({ onDelete, handleAudioFileChange, handleTranscriptionFileChange, status = StatusType.NOT_STARTED }) => {
    return (
        <div className="flex items-center justify-center space-x-4">
            <FilePicker fileType={FileType.AUDIO} onFileSelected={handleAudioFileChange} />
            <FilePicker fileType={FileType.TRANSCRIPTION} onFileSelected={handleTranscriptionFileChange} />
            <Status status={status} />
            <button onClick={onDelete} className="text-red-500 hover:text-red-700">
                <MdDelete size={24} />
            </button>
        </div>
    );
};

export default FileRow;
