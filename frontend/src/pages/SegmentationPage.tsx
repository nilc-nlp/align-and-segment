import React from 'react';
import InfoCard from '@/components/InfoCard';
import { MdAudiotrack, MdTextFields, MdSpeakerNotes } from 'react-icons/md';

const SegmentationPage: React.FC = () => {
    return (
        <div>
            <h1>Segmentation Page</h1>
            <div className='flex items-center justify-center'>
                <InfoCard
                    icon={MdAudiotrack}
                    title="Transcrição com locutores"
                    shortDescription="The speakers file must: 1. have identical words as the plain text transcription file. 2. each utterance must be anteceded by the name of the speaker in the format <i>speaker;utterance\n</i>"
                    markdownDescription='The speakers file must: 1. have identical words as the plain text transcription file. 2. each utterance must be anteceded by the name of the speaker in the format <i>speaker;utterance\n</i>'
                />
                <InfoCard
                    icon={MdTextFields}
                    title="Transcrição em TextGrid"
                    shortDescription="The file must be: 1. the .TextGrid file generated with UFPAlign "
                    markdownDescription='The file must be: 1. the .TextGrid file generated with UFPAlign 2. have identical words as the other file.'
                />
            </div>
            {/* Content for Segmentation page */}
        </div>
    );
};

export default SegmentationPage;
