// background.js - Service Worker for Chrome Extension
// Handles context menus and communication between webpage and side panel

let selectedText = '';
let selectedImageUrl = '';

// Create context menus when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('Darija Translator extension installed');
  
  // Context menu for selected text
  chrome.contextMenus.create({
    id: 'translateText',
    title: 'Translate to Darija',
    contexts: ['selection']
  });

  // Context menu for images
  chrome.contextMenus.create({
    id: 'translateImage',
    title: 'Translate Image to Darija',
    contexts: ['image']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'translateText') {
    // Store selected text
    selectedText = info.selectionText;
    console.log('Selected text stored:', selectedText);
    
    // Open side panel and wait a bit for it to load
    await chrome.sidePanel.open({ windowId: tab.windowId });
    
    // Send message to side panel after it opens
    setTimeout(() => {
      chrome.runtime.sendMessage({ 
        action: 'fillText', 
        text: selectedText 
      });
    }, 500);
  } 
  else if (info.menuItemId === 'translateImage') {
    // Store image URL
    selectedImageUrl = info.srcUrl;
    console.log('Selected image URL stored:', selectedImageUrl);
    
    // Open side panel and wait a bit for it to load
    await chrome.sidePanel.open({ windowId: tab.windowId });
    
    // Send message to side panel after it opens
    setTimeout(() => {
      chrome.runtime.sendMessage({ 
        action: 'fillImage', 
        imageUrl: selectedImageUrl 
      });
    }, 500); // 500ms delay ensures side panel is fully loaded
  }
});

// Listen for messages from side panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSelectedText') {
    // Send stored text to side panel
    sendResponse({ text: selectedText });
    selectedText = ''; // Clear after sending
  } 
  else if (request.action === 'getSelectedImage') {
    // Send stored image URL to side panel
    sendResponse({ imageUrl: selectedImageUrl });
    selectedImageUrl = ''; // Clear after sending
  }
  else if (request.action === 'getSelectedTextFromPage') {
    // Get currently selected text from active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: () => window.getSelection().toString()
        }, (results) => {
          if (results && results[0]) {
            sendResponse({ text: results[0].result });
          }
        });
      }
    });
    return true; // Keep message channel open for async response
  }
});