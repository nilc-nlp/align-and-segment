import React from 'react';
import InfoCard from '@/components/InfoCard';
import FileRowList from '@/components/FileRowList';
import { MdAudiotrack, MdTextFields, MdSpeakerNotes } from 'react-icons/md';

const AlignmentPage: React.FC = () => {
    return (
        <div>
            <div className='flex items-center justify-center'>
                <InfoCard
                    icon={MdAudiotrack}
                    title="Áudio"
                    shortDescription="The audio files must be in .wav format. They can have a maximum of 10 minutes."
                    markdownDescription='The audio files must be in .wav format, sample rate 16kHz and mono. They can have a maximum of 10 minutes.'
                />
                <InfoCard
                    icon={MdTextFields}
                    title="Transcrição"
                    shortDescription="O arquivo de transcrição deve estar no formato .txt e conter a transcrição correspondente ao áudio."
                    markdownDescription='The transcription file must contain the exact transcription in plain text, with words separated by single spaces, without punctuation marks. The format must be .txt'
                />
            </div>
            {/* Content for home page */}
            <FileRowList />
        </div>
    );
};

export default AlignmentPage;