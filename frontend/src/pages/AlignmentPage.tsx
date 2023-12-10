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
                    shortDescription="The audio files must be in .mp3 or .wav format. They can have a maximum of 10 minutes."
                    markdownDescription='# Hi, *Pluto*!'
                />
                <InfoCard
                    icon={MdTextFields}
                    title="Transcrição"
                    shortDescription="O arquivo de transcrição deve estar no formato .txt e conter a transcrição correspondente ao áudio."
                    markdownDescription='# Hi, *Pluto*!'
                />
            </div>
            {/* Content for home page */}
            <FileRowList />
        </div>
    );
};

export default AlignmentPage;