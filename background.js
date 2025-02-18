const requestDiff = [
    "CometNewsFeedPaginationQuery",
    "GroupsCometFeedRegularStoriesPaginationQuery",
    "ProfileCometTimelineFeedRefetchQuery"
];

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        console.log("Background received message:", message);

        try {
            if (message.type === 'FRAPPE_DATA') {
                const responseData = {
                    status: 'success',
                    timestamp: Date.now(),
                    data: message.data
                };
                
                // Send response immediately
                sendResponse(responseData);
                
                // Process data if needed
                console.log("Processing GraphQL data:", message.data);
            }
        } catch (error) {
            console.error("Error in background:", error);
            sendResponse({ status: 'error', error: error.message });
        }
        
        // Must return true to indicate async response
        return true;
    }
);