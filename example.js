
// // Intercept fetch requests and log the response body
// chrome.webRequest.onCompleted.addListener(
//     function(details) {
//         if (details.type === 'xmlhttprequest' && details.method === 'POST') {
//             chrome.scripting.executeScript({
//                 target: { tabId: details.tabId },
//                 func: function() {
//                     if (window.hasOwnProperty('fetchIntercepted')) return;
//                     window.fetchIntercepted = true;

//                     const originalFetch = window.fetch;
//                     window.fetch = async function(...args) {
//                         const response = await originalFetch.apply(this, args);
//                         const clone = response.clone();
//                         clone.text().then(body => {
//                             console.log('XHR Response:', {
//                                 url: response.url,
//                                 responseBody: body
//                             });
//                         }).catch(err => console.error('Error reading response:', err));
//                         return response;
//                     };
//                 }
//             }).catch(err => console.error('Script injection failed:', err));
//         }
//     },
//     { urls: ["<all_urls>"] },
//     ["responseHeaders", "extraHeaders"]
// );

// // JS
// let oldXHROpen1 = window.XMLHttpRequest.prototype.open;
// window.XMLHttpRequest.prototype.open = function() {
//   this.addEventListener("load", function() {
//     const responseBody = this.responseText;
//     console.log("Response Body:", this);
//   });
//   return oldXHROpen.apply(this, arguments);
// };

// const oldXHROpen = window.XMLHttpRequest.prototype.open;
// window.XMLHttpRequest.prototype.open = function() {
//   this.addEventListener("load", function() {
//     // Check if the request body meets your condition before logging.
//     if (this.responseURL.includes("graphql") && this._requestBody.includes("GroupsCometFeedRegularStoriesPaginationQuery")) {
//       console.log("Response Body for request matching criteria:", this.responseText);
//     }
//   });
//   return oldXHROpen.apply(this, arguments);
// };

// // Override send to capture the request body.
// const oldXHRSend = window.XMLHttpRequest.prototype.send;
// window.XMLHttpRequest.prototype.send = function(body) {
//   this._requestBody = body; // Store the request body on the instance.
//   return oldXHRSend.call(this, body);
// };