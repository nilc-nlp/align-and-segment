import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage'; // Create this component
import AlignmentPage from '@/pages/AlignmentPage'; // Create this component
import SegmentationPage from '@/pages/SegmentationPage'; // Create this component
import './App.css';
const App: React.FC = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/alignment" element={<AlignmentPage />} />
        <Route path="/segmentation" element={<SegmentationPage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
