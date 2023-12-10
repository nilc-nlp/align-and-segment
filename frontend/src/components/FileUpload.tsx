import React, { useState } from 'react';
import axios from 'axios';
import FileInputPair from './FileInputPair';

type FilePair = {
  audioFile: File | null;
  transcriptionFile: File | null;
};

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  const [filePairs, setFilePairs] = useState<FilePair[]>([{ audioFile: null, transcriptionFile: null }]);

  const handleAddPair = () => {
    setFilePairs([...filePairs, { audioFile: null, transcriptionFile: null }]);
  };

  const handleAudioFileChange = (index: number, file: File | null) => {
    const newFilePairs = [...filePairs];
    newFilePairs[index].audioFile = file;
    setFilePairs(newFilePairs);
  };

  const handleTranscriptionFileChange = (index: number, file: File | null) => {
    const newFilePairs = [...filePairs];
    newFilePairs[index].transcriptionFile = file;
    setFilePairs(newFilePairs);
  };

  const handleSubmit = () => {
    // Implement your submit logic here
    console.log(filePairs);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFile(file);
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/upload/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setTaskId(response.data.task_id);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const checkStatus = async () => {
    if (taskId) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/status/${taskId}`);
        setStatus(response.data.status);
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    }
  };

  return (
    <div>
      {filePairs.map((pair, index) => (
        <FileInputPair
          key={index}
          onAudioFileChange={(file) => handleAudioFileChange(index, file)}
          onTranscriptionFileChange={(file) => handleTranscriptionFileChange(index, file)}
        />
      ))}
      <button onClick={handleAddPair} style={{ borderRadius: '50%' }}>+</button>
      <button onClick={handleUpload}>Submit</button>

      {taskId && (
        <div>
          <p>Task ID: {taskId}</p>
          <button onClick={checkStatus}>Check Status</button>
          <p>Status: {status}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
