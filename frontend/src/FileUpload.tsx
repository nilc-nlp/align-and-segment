import React, { useState } from 'react';
import axios from 'axios';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

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
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
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
