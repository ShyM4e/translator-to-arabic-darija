import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState('');
  const [authUser, setAuthUser] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [loadingText, setLoadingText] = useState(false);   
  const [loadingImage, setLoadingImage] = useState(false);
  
  const [error, setError] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // helper to set axios basic auth header
  const setAuthHeader = (user, pass) => {
    if (user && pass) {
      const token = btoa(`${user}:${pass}`);
      axios.defaults.headers.common['Authorization'] = `Basic ${token}`;
      localStorage.setItem('basicAuth', token);
      setIsAuthenticated(true);
    }
  };

  useEffect(() => {
    // Prefill from runtime env (build-time) if present
    const defaultUser = process.env.REACT_APP_AUTH_USER || '';
    const defaultPass = process.env.REACT_APP_AUTH_PASS || '';

    // If token in localStorage, use it
    const stored = localStorage.getItem('basicAuth');
    if (stored) {
      axios.defaults.headers.common['Authorization'] = `Basic ${stored}`;
      setIsAuthenticated(true);
      return;
    }

    // If both provided as env variables (dev convenience), prefill but do not auto-login
    if (defaultUser && defaultPass) {
      setAuthUser(defaultUser);
      setAuthPass(defaultPass);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!authUser || !authPass) return;
    setAuthHeader(authUser, authPass);
  };

  const handleLogout = () => {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('basicAuth');
    setIsAuthenticated(false);
  };

  const handleTranslateText = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to translate');
      return;
    }

    setLoadingText(true);
    setError('');
    setTranslation('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/translate`, {
        text: inputText
      });

      if (response.data.success) {
        setTranslation(response.data.translation);
      } else {
        setError('Translation failed: ' + response.data.message);
      }
    } catch (err) {
      setError('Backend unreachable. Start your server.');
    } finally {
      setLoadingText(false); 
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleTranslateImage = async () => {
    if (!image) {
      setError("Please upload an image first");
      return;
    }

    setLoadingImage(true);
    setError('');
    setTranslation('');

    const formData = new FormData(); // FormData is a special javaScript object for file uploads via HTTP
    formData.append("image", image);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/translate-image`,
        formData
      );

      if (response.data.success) {
        setTranslation(response.data.translation);
      } else {
        setError("Failed to translate image");
      }

    } catch (err) {
      setError("Cannot connect to backend.");
    } finally {
      setLoadingImage(false); 
    }
  };

  // SPEAK TRANSLATION
  const handleSpeak = () => {
    if (!translation) return;
    try {
      const synth = window.speechSynthesis;
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(translation);
      // prefer Arabic voice; browser will choose a matching available voice
      utter.lang = 'ar';
      utter.rate = 1;
      synth.speak(utter);
    } catch (e) {
      console.warn('Speech synthesis not available', e);
    }
  };

  const handleClear = () => {
    setInputText('');
    setTranslation('');
    setError('');
    setImage(null);
    setImagePreview(null);
  };

  const isAnyLoading = loadingText || loadingImage;

  if (!isAuthenticated) {
    return (
      <div className="App">
        <div className="container">
          <h1>Login</h1>
          <form onSubmit={handleLogin} className="login-form">
            <label>Username</label>
            <input value={authUser} onChange={(e) => setAuthUser(e.target.value)} />
            <label>Password</label>
            <input type="password" value={authPass} onChange={(e) => setAuthPass(e.target.value)} />
            <div className="button-group">
              <button type="submit" className="btn-primary">Login</button>
            </div>
            <p className="subtitle">Credentials should be set in environment variables on server and optionally in `REACT_APP_AUTH_*` for dev.</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="container">
        <h1>toArabic(Darija) Translator</h1>
        <p className="subtitle">Text & Image Translator (Gemini AI)</p>

      <div style={{ textAlign: 'right', marginBottom: 12 }}>
        <button onClick={handleLogout} className="btn-secondary">Logout</button>
      </div>

        {/* TEXT INPUT */}
        <div className="translation-box">
          <h3>Enter Text</h3>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your text here..."
            rows="6"
            disabled={isAnyLoading} 
          />
          <div className="char-count">
            {inputText.length} / 5000 characters
          </div>
        </div>

        {/* IMAGE UPLOAD */}
        <div className="translation-box">
          <h3>Upload Image</h3>
          <input type="file" accept="image/*" onChange={handleImageUpload} />

          {imagePreview && (
            <img src={imagePreview} alt="preview" className="image-preview" />
          )}
        </div>

        {/* BUTTONS */}
        <div className="button-group">
          <button 
            onClick={handleTranslateText}
            disabled={loadingText || !inputText.trim()} 
            className="btn-primary"
          >
            {loadingText ? 'Translating...' : 'Translate Text'}
          </button>

          <button 
            onClick={handleTranslateImage}
            disabled={loadingImage || !image} 
            className="btn-primary"
          >
            {loadingImage ? 'Processing Image...' : 'Translate Image'}
          </button>

          <button
            onClick={handleSpeak}
            disabled={!translation || isAnyLoading}
            className="btn-primary"
          >
            {translation ? '🔊 Speak' : '🔇 Speak'}
          </button>

          <button 
            onClick={handleClear}
            disabled={isAnyLoading}
            className="btn-secondary"
          >
            Clear
          </button>
        </div>

        {/* ERRORS */}
        {error && (
          <div className="error-box">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* RESULT */}
        {translation && (
          <div className="translation-box result">
            <h3>Darija Translation ترجمة</h3>
            <div className="arabic-text" dir="rtl">
              {translation}
            </div>
          </div>
        )}

        <div className="footer">
          <p>Node.js + React + Gemini Multimodal</p>
        </div>
      </div>
    </div>
  );
}

export default App;