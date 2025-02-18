// chrome.devtools.network.onRequestFinished.addListener(request => {
//     request.getContent((body) => {
//         if (request.request && request.request.url) {
//             if (request.request.url.includes('facebook.com') && request.request.url.includes('graphql')) {
//                 // Continue with custom code
//                 console.log("Request Body:", body);
//                 try {
//                     var bodyObj = JSON.parse(body); // etc.
//                     console.log("Facebook GraphQL Body:", bodyObj);
//                 } catch (e) {
//                     console.error("Error parsing response body:", e);
//                 }
//             }
//         }
//     });
// });