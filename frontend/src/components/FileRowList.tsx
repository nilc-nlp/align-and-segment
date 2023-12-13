import { useState, useEffect } from 'react';
import React from 'react';
import FileRow from '@/components/FileRow';
import { StatusType } from '@/types';
import { Button } from '@mui/material';
import {
    MdAdd, MdLinearScale, MdFileDownload
} from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

type FilePair = {
    audioFile?: File | null;
    transcriptionFile: File | null;
    taskId: string | null;
    status: StatusType;
    taskResult?: any | null;
};

const FileRowList: React.FC = () => {

    const [fileRows, setFileRows] = useState<FilePair[]>(() => {
        const savedFileRows = localStorage.getItem('fileRows');
        return savedFileRows ? JSON.parse(savedFileRows) : [{ audioFile: null, transcriptionFile: null, taskId: null, status: StatusType.NOT_STARTED }];
    });
    const [readyToSubmit, setReadyToSubmit] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {

        // Save fileRows to localStorage
        localStorage.setItem('fileRows', JSON.stringify(fileRows));

        // Check if all file pairs have both audioFile and transcriptionFile
        const allFilesPresent = fileRows.every(pair => pair.audioFile && pair.transcriptionFile && pair.taskId === null);
        const finishedProcessing = fileRows.every(pair => pair.status === StatusType.SUCCESS || pair.status === StatusType.FAILURE);
        setProcessing(!finishedProcessing);

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

    const setTaskResult = (index: number, taskResult: any) => {
        const newFileRows = [...fileRows];
        newFileRows[index].taskResult = taskResult?.result;
        setFileRows(newFileRows);
    }

    const handleSubmit = async () => {
        setProcessing(true);
        setSubmitted(true);
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
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/alignment`, formData, {
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
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/alignment/${filePair.taskId}`);
            setStatus(index, response.data.status);
            if (response.data.status === StatusType.SUCCESS) {
                setTaskResult(index, {
                    fileName: response.data.split('/').pop()
                });
            }
            else if (response.data.status === StatusType.FAILURE) {
                console.error('Error processing file:', response.data.message);
            }
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

    const handleDownload = async () => {
        const zip = new JSZip();

        for (const filePair of fileRows) {
            if (filePair.taskResult !== null) {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/alignment/${filePair.taskId}/download`, { responseType: 'blob' });
                    zip.file(filePair.taskResult.fileName, response.data);
                } catch (error) {
                    console.error('Error downloading file:', error);
                }
            }
        }

        // Generate ZIP file and trigger download
        zip.generateAsync({ type: 'blob' }).then((content) => {
            saveAs(content, 'files.zip');
        });
    };

    const handleGoToSegmentation = () => {
        navigate('/segmentation');
    };

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
                {!submitted || processing ? (
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!readyToSubmit || (submitted && processing)}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                ) : (
                    <>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleGoToSegmentation}
                            style={{ marginRight: '10px' }}
                        >
                            <MdLinearScale style={{ marginRight: '5px' }} />
                            Go to Segmentation
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleDownload}
                        >
                            <MdFileDownload style={{ marginRight: '5px' }} />
                            Download
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default FileRowList;
