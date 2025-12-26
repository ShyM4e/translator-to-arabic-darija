const API_URL = 'http://localhost:5000/api';

const inputText = document.getElementById('inputText');
const translateBtn = document.getElementById('translateBtn');
const imageInput = document.getElementById('imageInput');
const translateImageBtn = document.getElementById('translateImageBtn');
const clearBtn = document.getElementById('clearBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const result = document.getElementById('result');
const translationText = document.getElementById('translationText');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');

// Auth elements
const authSection = document.getElementById('authSection');
const authUserInput = document.getElementById('authUser');
const authPassInput = document.getElementById('authPass');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

let selectedImage = null;
let authToken = null; // base64 token (without 'Basic ' prefix)

// Initialize auth state from chrome.storage
chrome.storage.local.get(['basicAuthToken'], (items) => {
  if (items && items.basicAuthToken) {
    authToken = items.basicAuthToken;
    authSection.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
  } else {
    authSection.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
  }
});

// Login handler
loginBtn.addEventListener('click', () => {
  const user = authUserInput.value.trim();
  const pass = authPassInput.value;
  if (!user || !pass) {
    showError('Enter username and password');
    return;
  }
  const token = btoa(`${user}:${pass}`);
  chrome.storage.local.set({ basicAuthToken: token }, () => {
    authToken = token;
    authSection.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
    hideAll();
  });
});

logoutBtn.addEventListener('click', () => {
  chrome.storage.local.remove('basicAuthToken', () => {
    authToken = null;
    authSection.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
    hideAll();
  });
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Side panel received message:', request);
  
  if (request.action === 'fillText') {
    console.log('Filling text:', request.text);
    inputText.value = request.text;
    inputText.focus();
    sendResponse({ success: true });
  } 
  else if (request.action === 'fillImage') {
    console.log('Filling image:', request.imageUrl);
    loadImageFromUrl(request.imageUrl);
    sendResponse({ success: true });
  }
});

// Load image from URL (when right-clicked on webpage)
async function loadImageFromUrl(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], 'image.png', { type: blob.type });
    
    selectedImage = file;
    previewImg.src = url;
    imagePreview.classList.remove('hidden');
  } catch (err) {
    showError('Failed to load image from webpage');
  }
}

// TEXT TRANSLATION
translateBtn.addEventListener('click', async () => {
  const text = inputText.value.trim();
  
  if (!text) {
    showError('Please enter some text');
    return;
  }

  hideAll();
  loading.classList.remove('hidden');

  try {
    if (!authToken) {
      showError('Please login first');
      return;
    }

    const response = await fetch(`${API_URL}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authToken}`
      },
      body: JSON.stringify({ text })
    });

    const data = await response.json();

    if (data.success) {
      translationText.textContent = data.translation;
      result.classList.remove('hidden');
    } else {
      showError(data.message || 'Translation failed');
    }

  } catch (err) {
    showError('Cannot connect to server. Make sure backend is running on http://localhost:5000');
  } finally {
    loading.classList.add('hidden');
  }
});

// IMAGE UPLOAD PREVIEW
imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedImage = file;
    const reader = new FileReader();
    reader.onload = (event) => {
      previewImg.src = event.target.result;
      imagePreview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }
});

// IMAGE TRANSLATION
translateImageBtn.addEventListener('click', async () => {
  if (!selectedImage) {
    showError('Please select an image first or right-click an image on webpage');
    return;
  }

  hideAll();
  loading.classList.remove('hidden');

  const formData = new FormData();
  formData.append('image', selectedImage);

  try {
    if (!authToken) {
      showError('Please login first');
      return;
    }

    const response = await fetch(`${API_URL}/translate-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authToken}`
      },
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      translationText.textContent = data.translation;
      result.classList.remove('hidden');
    } else {
      showError(data.message || 'Image translation failed');
    }

  } catch (err) {
    showError('Cannot connect to server. Make sure backend is running on http://localhost:5000');
  } finally {
    loading.classList.add('hidden');
  }
});

// CLEAR ALL
clearBtn.addEventListener('click', () => {
  inputText.value = '';
  imageInput.value = '';
  selectedImage = null;
  imagePreview.classList.add('hidden');
  hideAll();
});

function showError(message) {
  error.textContent = message;
  error.classList.remove('hidden');
}

function hideAll() {
  loading.classList.add('hidden');
  error.classList.add('hidden');
  result.classList.add('hidden');
}