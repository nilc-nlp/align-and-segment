import React, { useState } from 'react';
import { MdAudiotrack, MdTextFields, MdSpeakerNotes } from 'react-icons/md';
import { FileType } from '@/types'; // Update with the correct path

interface FilePickerProps {
    fileType?: FileType; // Made optional
    onFileSelected?: (file: File) => void; // Made optional
}

const FilePicker: React.FC<FilePickerProps> = ({ fileType = FileType.AUDIO, onFileSelected }) => {
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFileName(event.target.files[0].name);
            if (onFileSelected) {
                onFileSelected(event.target.files[0]);
            }
        }
    };

    let icon;
    let placeholder;
    let allowed_extensions;

    switch (fileType) {
        case FileType.AUDIO:
            icon = <MdAudiotrack />;
            placeholder = "Escolha um arquivo de áudio";
            allowed_extensions = ['.mp3', '.wav']
            break;
        case FileType.TRANSCRIPTION:
            icon = <MdTextFields />;
            placeholder = "Escolha um arquivo de transcrição";
            allowed_extensions = ['.txt']
            break;
        case FileType.DIARIZATION:
            icon = <MdSpeakerNotes />;
            placeholder = "Escolha um arquivo de diarização";
            allowed_extensions = ['.txt']
            break;
    }

    return (
        <div className="flex items-center">
            <label className="cursor-pointer flex items-center bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-150">
                {icon}
                <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept={allowed_extensions.join(',')}
                />
                <span className="ml-2">Escolher</span>
            </label>
            <input
                type="text"
                className="p-2 border-blue-500 border-l-0 rounded-r w-80"
                readOnly
                placeholder={placeholder}
                value={fileName || ''}
            />
        </div>
    );
};
export default FilePicker;
