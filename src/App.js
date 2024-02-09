// src/App.js
import React, { useState, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import './App.css';

function App() {
  const [ocrText, setOcrText] = useState('');
  const [imageDataUri, setImageDataUri] = useState(null);
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    const initializeWorker = async () => {
      const workerInstance = await createWorker();
      await workerInstance.load();
      await workerInstance.loadLanguage('eng');
      await workerInstance.initialize('eng');
      setWorker(workerInstance);
    };

    initializeWorker();

    return () => {
      if (worker) {
        worker.terminate();
      }
    };
  }, []);

  const convertImageToText = async () => {
    if (!imageDataUri || !worker) return;

    const { data: { text } } = await worker.recognize(imageDataUri);
    setOcrText(text);
  };

  useEffect(() => {
    convertImageToText();
  }, [imageDataUri, worker]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result;
      setImageDataUri(imageData);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="App">
      <div>
        <p>Choose an Image</p>
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
        />
      </div>
      <div className="display-flex">
        <img src={imageDataUri} alt="" />
        <p>{ocrText}</p>
      </div>
    </div>
  );
}

export default App;
