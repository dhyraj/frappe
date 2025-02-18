// codeBlock = `const oldXHROpen = window.XMLHttpRequest.prototype.open;
//     window.XMLHttpRequest.prototype.open = function() {
//     this.addEventListener("load", function() {
//         // Check if the request body meets your condition before logging.
//         if (this.responseURL.includes("graphql") && this._requestBody.includes("GroupsCometFeedRegularStoriesPaginationQuery")) {
//         console.log("Response Body for request matching criteria:", this.responseText);
//         }
//     });
//     return oldXHROpen.apply(this, arguments);
//     };

//     // Override send to capture the request body.
//     const oldXHRSend = window.XMLHttpRequest.prototype.send;
//     window.XMLHttpRequest.prototype.send = function(body) {
//     this._requestBody = body; // Store the request body on the instance.
//     return oldXHRSend.call(this, body);
//     };`;


// console.log('Injecting script into the page');
// const scriptElement = document.createElement('script');
// scriptElement.setAttribute('type', 'text/javascript');
// scriptElement.textContent = codeBlock;
// // Inject before closing HTML tag `</html>`
// document.documentElement.appendChild(scriptElement);