import { useState, useEffect } from 'react';
import React from 'react';
import FileRow from '@/components/FileRow';
import { StatusType } from '@/types';
import { Button } from '@mui/material';
import { MdAdd } from 'react-icons/md';
import axios from 'axios';

type FilePair = {
    audioFile: File | null;
    transcriptionFile: File | null;
    taskId: string | null;
    status: StatusType;
};

const FileRowList: React.FC = () => {

    const [fileRows, setFileRows] = useState<FilePair[]>([{ audioFile: null, transcriptionFile: null, taskId: null, status: StatusType.NOT_STARTED }]);
    const [readyToSubmit, setReadyToSubmit] = useState<boolean>(false);

    useEffect(() => {
        // Check if all file pairs have both audioFile and transcriptionFile
        const allFilesPresent = fileRows.every(pair => pair.audioFile && pair.transcriptionFile);

        setReadyToSubmit(allFilesPresent);
    }, [fileRows]);

    const handleAddPair = () => {
        setFileRows([...fileRows, { audioFile: null, transcriptionFile: null, taskId: null, status: StatusType.NOT_STARTED }]);
    };

    const handleDeletePair = (index: number) => {
        const newFileRows = [...fileRows];
        newFileRows.splice(index, 1);
        setFileRows(newFileRows);
    }

    const setTaskId = (index: number, taskId: string) => {
        const newFileRows = [...fileRows];
        newFileRows[index].taskId = taskId;
        setFileRows(newFileRows);
    }

    const setStatus = (index: number, status: StatusType) => {
        const newFileRows = [...fileRows];
        newFileRows[index].status = status;
        setFileRows(newFileRows);
    }

    const handleSubmit = async () => {

        fileRows.forEach(async (filePair, index) => {
            if (!filePair.audioFile || !filePair.transcriptionFile) {
                alert(`Please select both an audio file and a transcription file for the row #${index + 1}.`);
                return;
            }
            await submitFilePair(index, filePair);
        });


    }

    const submitFilePair = async (index: number, filePair: FilePair) => {

        const formData = new FormData();
        formData.append('audio_file', filePair.audioFile as File);
        formData.append('transcription_file', filePair.transcriptionFile as File);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/upload/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setTaskId(index, response.data.task_id);

            // Set up an interval to check status
            const interval = setInterval(async () => {
                await checkStatus(index, filePair);
                // Assuming setStatus updates the fileRows state
                if (fileRows[index].status === StatusType.SUCCESS || fileRows[index].status === StatusType.FAILURE) {
                    clearInterval(interval);
                }
            }, 5000);

        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const checkStatus = async (index: number, filePair: FilePair) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/status/${filePair.taskId}`);
            setStatus(index, response.data.status);
        } catch (error) {
            console.error('Error fetching status:', error);
        }
    };

    const onAudioFileChange = (index: number, file: File | null) => {
        const newFileRows = [...fileRows];
        newFileRows[index].audioFile = file;
        setFileRows(newFileRows);
    }

    const onTranscriptionFileChange = (index: number, file: File | null) => {
        const newFileRows = [...fileRows];
        newFileRows[index].transcriptionFile = file;
        setFileRows(newFileRows);
    }

    return (
        <div className='flex flex-col'>
            <div className='w-5/6 m-auto'>
                {fileRows.map((filePair, index) => (
                    <div className='flex justify-evenly items-center mt-4' key={index}>
                        <span className='text-gray-600 text-2xl font-extrabold mr-16 tabular-nums'>
                            {index + 1}.
                        </span>
                        <FileRow
                            key={index}
                            onDelete={() => { handleDeletePair(index) }}
                            status={filePair.status}
                            handleAudioFileChange={(file: File) => { onAudioFileChange(index, file) }}
                            handleTranscriptionFileChange={(file: File) => { onTranscriptionFileChange(index, file) }}
                        />
                    </div>
                ))}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddPair}
                    style={{
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        minWidth: '40px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '10px',
                        marginLeft: 'auto',
                        marginTop: '40px'
                    }}
                >
                    <MdAdd size={32} />
                </Button>
            </div>
            <div className='border-t border-gray-200 m-auto pt-5 w-5/6 mt-10 justify-center flex'>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={!readyToSubmit}
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </div>
        </div>
    );
};

export default FileRowList;
