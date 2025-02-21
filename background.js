const requestDiff = [
    "CometNewsFeedPaginationQuery",
    "GroupsCometFeedRegularStoriesPaginationQuery",
    "ProfileCometTimelineFeedRefetchQuery"
];

// Log immediate initialization
console.log('💫 Background script starting...');

chrome.runtime.onInstalled.addListener(() => {
    console.log('🚀 Extension installed/updated');
});

function saveToFile(data) {
    // Create date-based filename with timestamp
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-');
    const filename = `facebook_group_posts_${timestamp}.json`;
    
    // Convert data to JSON string with pretty printing
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    chrome.downloads.download({
        url: url,
        filename: filename,
        saveAs: false
    }, (downloadId) => {
        URL.revokeObjectURL(url);
        console.log('💾 Data saved to:', filename);
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    // Always send an immediate response
    sendResponse({
        data: message.data,
        status: 'received',
        timestamp: Date.now()
    });

    // Process GROUP_POST messages
    if (message.type === 'GROUP_POST') {
        console.log('🎯 Processing group post data', message.data.response);
        try {
            // Save data to file
            // saveToFile(message.data.response);
        } catch (error) {
            console.error('❌ Error saving data:', error);
        }
    }

    return true;
});

// Confirm background script is ready
console.log('✅ Background script initialized');