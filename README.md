# Translator Project – Text & Image to Moroccan Darija

A full-stack translation application that converts English text and extracts/translates text from images into Moroccan Darija (Arabic) using Google Gemini AI. Built with Node.js, React, and a browser extension for quick access.

---

## Project Overview

This project consists of three main components:

1. **Backend** – Express.js server handling translation requests via the Gemini API
2. **Frontend** – React app for text input, image upload, translation display, and speech synthesis
3. **Extension** – Chrome/Firefox extension offering quick-access translation from the browser sidepanel

---

## Architecture

### Backend (`backend/`)

**Entry Point:** `index.js`
- Loads environment variables via `env-loader.js`
- Initializes Express server on configured `PORT`
- Registers translation routes

**Routes:** `src/routes/translation.routes.js`
- `POST /api/translate` – Translate plain text
- `POST /api/translate-image` – Extract text from image and translate

**Controllers:** `src/controllers/translation.controllers.js`
- Validates incoming requests
- Calls translation services
- Returns structured JSON responses (`{ success, translation, message }`)
- Handles errors with consistent error messages

**Services:** `src/services/translation.services.js`
- Core integration with Google Gemini AI
- Manages text and image payload preparation
- Parses API responses
- Implements error handling and fallbacks

**Config:** `src/config/gemini.js`
- Stores Gemini API configuration and initialization

**Error Handler:** `src/middleware/error.handler.js`
- Global error middleware for Express

### Frontend (`frontend/`)

**Main App:** `src/App.js`
- React component managing UI state: `inputText`, `translation`, `image`, `imagePreview`, `loadingText`, `loadingImage`, `error`
- Reads backend URL from `process.env.REACT_APP_API_BASE_URL`

**Key Handlers:**

1. **`handleTranslateText()`**
   ```javascript
   // Posts { text: inputText } to /api/translate
   // Sets translation on success, error on failure
   // Uses setLoadingText() to prevent duplicate requests
   ```

2. **`handleTranslateImage()`**
   ```javascript
   // Uploads image as FormData to /api/translate-image
   // Shows image preview before upload
   // Sets translation result or error
   ```

3. **`handleSpeak()`** *(newly added)*
   ```javascript
   // Uses window.speechSynthesis API to speak translation aloud
   // Sets language to 'ar' for Arabic voices
   // Gracefully handles missing voice support
   ```

**UI Features:**
- Character counter for text input
- Image file picker with preview
- Translation result with right-to-left (RTL) text direction for Arabic
- Error display box
- Clear button to reset all fields

### Extension (`translation-extension/`)

**Files:**
- `manifest.json` – Extension metadata, permissions, and sidepanel configuration
- `sidepanel.html` – UI layout (input, buttons, output)
- `sidepanel.js` – Event listeners, API calls to backend (`/api/translate` endpoint)
- `background.js` – Background script for persistent state and request mediation

**How It Works:**
- User opens sidepanel from browser toolbar
- Enters text or pastes selection
- Clicks "Translate" to call the same backend endpoints as the web frontend
- Result displays in the sidepanel

---

## Setup & Installation

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the server:
```bash
node index.js
```

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```
REACT_APP_API_BASE_URL=http://localhost:5000
```

Start the development server:
```bash
npm start
```

The app will run on `http://localhost:3000`.

### Extension

1. Open your browser and navigate to `chrome://extensions` (or `about:debugging#/runtime/this-firefox` for Firefox)
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `translation-extension/` folder
4. The extension icon will appear in your toolbar

---

## Key Code Highlights for Presentation

### 1. Backend API Integration (Service Layer)
**File:** `backend/src/services/translation.services.js`

This file shows:
- How to prepare text/image payloads for an external AI API
- How to handle API responses and errors
- Why keeping business logic in services keeps code maintainable

### 2. Frontend State Management & API Calls
**File:** `frontend/src/App.js`

Key patterns:
- `useState` hooks for managing form state, loading, and errors
- `axios` for HTTP requests
- Error handling with user-friendly messages
- Loading states to prevent duplicate submissions

### 3. Text-to-Speech Integration
**File:** `frontend/src/App.js` – `handleSpeak()` function

Demonstrates:
- Using native browser APIs (`window.speechSynthesis`)
- Graceful degradation if feature is unavailable
- Localization hints (setting `utter.lang = 'ar'`)

### 4. RTL Text Rendering
**File:** `frontend/src/App.js` – Result display

Shows how to properly display Arabic:
```html
<div className="arabic-text" dir="rtl">
  {translation}
</div>
```

---

## Features

✅ **Text Translation** – Input English, get Moroccan Darija output  
✅ **Image Translation** – Upload an image, extract text, and translate  
✅ **Speech Synthesis** – Click "Speak" to hear the translation in Arabic  
✅ **Browser Extension** – Quick access from sidepanel without opening the web app  
✅ **Error Handling** – Friendly messages if backend is unreachable or API fails  
✅ **Responsive UI** – Works on desktop and mobile  

---

## Running the Full Stack

**Terminal 1 – Backend:**
```bash
cd backend
node index.js
```

**Terminal 2 – Frontend:**
```bash
cd frontend
npm start
```

**Browser:**
- Open http://localhost:3000
- Load the extension via developer mode in `translation-extension/`

---

## Project Structure

```
translator/
├── backend/
│   ├── env-loader.js
│   ├── index.js
│   ├── package.json
│   └── src/
│       ├── config/
│       │   └── gemini.js
│       ├── controllers/
│       │   └── translation.controllers.js
│       ├── middleware/
│       │   └── error.handler.js
│       ├── routes/
│       │   └── translation.routes.js
│       └── services/
│           └── translation.services.js
├── frontend/
│   ├── package.json
│   ├── README.md
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   └── src/
│       ├── App.css
│       ├── App.js
│       ├── index.css
│       └── index.js
├── translation-extension/
│   ├── background.js
│   ├── manifest.json
│   ├── sidepanel.css
│   ├── sidepanel.html
│   └── sidepanel.js
└── README.md
```


## License

This project is provided as-is for educational purposes.

---

**Built with:** Node.js • Express • React • Google Gemini API • Web Speech API
All rights reserved EL BOUSSADANY Chaymae 2025