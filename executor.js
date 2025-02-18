// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     console.log("Tab updated:", tabId, changeInfo, tab);
//     if (typeof tab.url !== 'undefined' && tab.url !== null) {
//         console.log("Tab URL:", tab.url);
//         if (tab.url.includes("facebook.com")) {
//             console.log("Injecting script into tab:", tabId);
//             chrome.scripting.executeScript({
//                 target: { tabId: tabId, allFrames: true },
//                 // Content script runs alongside page's main JavaScript
//                 world: 'MAIN',
//                 files: [
//                     // Include the core injection types
//                     'XMLHttpRequestOverride.js'
//                 ]
//             });
//         }
//     }
// });