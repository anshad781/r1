// src/App.js
import React, { useState, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import './App.css';

function App() {
  const [ocrText, setOcrText] = useState('');
  const [imageDataUri, setImageDataUri] = useState(null);
  const worker = createWorker({
    logger: (m) => console.log(m),
    errorHandler: (err) => {
      console.log(err);
      console.log('\u0007'); // Beep sound to alert
      return err; // Return the error
    },
  });
  

  const convertImageToText = async () => {
    if (!imageDataUri) return;

    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    const { data: { text } } = await worker.recognize(imageDataUri);
    setOcrText(text);
  };

  useEffect(() => {
    convertImageToText();
  }, [imageDataUri]);

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
