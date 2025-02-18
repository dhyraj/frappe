(() => {
    function injectScript(filePath) {
        const container = document.head || document.documentElement;
        const scriptEl = document.createElement('script');
        scriptEl.src = chrome.runtime.getURL(filePath);
        scriptEl.type = 'text/javascript';
        container.appendChild(scriptEl);
        scriptEl.onload = () => {
            console.log('Frappe: Script injected successfully');
            scriptEl.remove(); // Clean up after injection
        };
    }

    // Wait for document ready state
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => injectScript('injector.js'));
    } else {
        injectScript('injector.js');
    }

    // Listen for messages from the injected script
    window.addEventListener('message', (event) => {
        if (event.source !== window) return;
        
        const { type, data } = event.data;
        if (type === 'FRAPPE_DATA') {
            // Send message and explicitly handle the response
            chrome.runtime.sendMessage({ type, data })
                .then(response => {
                    console.log('Background response:', response);
                    // Notify injector of successful processing if needed
                    window.postMessage({ 
                        type: 'FRAPPE_RESPONSE',
                        status: 'success',
                        response 
                    }, '*');
                })
                .catch(error => {
                    console.error('Message sending failed:', error);
                });
        }
    });
})();