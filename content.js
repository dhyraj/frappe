(() => {
    // Scroll control state
    let processingResponse = false;
    let scrollInterval = null;
    let isScrollingPaused = false;

    function initializeStatusUI() {
        // Create status UI if it doesn't exist
        if (!document.getElementById('frappe-status')) {
            const statusDiv = document.createElement('div');
            statusDiv.id = 'frappe-status';
            statusDiv.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                z-index: 9999;
                font-family: Arial;
                pointer-events: none;
            `;
            document.body.appendChild(statusDiv);
            updateScrollStatus();
        }
    }
    
    function updateScrollStatus() {
        const statusDiv = document.getElementById('frappe-status');
        if (statusDiv) {
            statusDiv.textContent = `Scrolling: ${isScrollingPaused ? '⏸️ PAUSED' : '▶️ ACTIVE'} (Press ESC to toggle)`;
            statusDiv.style.background = isScrollingPaused ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.8)';
        }
    }

    function toggleScrolling(event) {
        if (event.key === 'Escape') {
            isScrollingPaused = !isScrollingPaused;
            console.log(isScrollingPaused ? '⏸️ Scrolling paused' : '▶️ Scrolling resumed');
            
            if (isScrollingPaused) {
                stopAutoScroll();
            } else {
                startAutoScroll();
            }
            
            updateScrollStatus();
        }
    }

    // Add keyboard listener
    document.addEventListener('keydown', toggleScrolling);

    // Add helper functions for actions
    function autoScroll() {
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
        const currentPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const scrollStep = windowHeight ;
        
        // Calculate new scroll position
        const newPosition = Math.min(
            currentPosition + scrollStep,
            documentHeight - windowHeight
        );
        
        window.scrollTo({
            top: newPosition,
            behavior: 'smooth'
        });
        
        console.log('🔄 Auto-scrolling page...');
    }

    function reloadPage() {
        console.log('⚠️ Reloading page due to error...');
        setTimeout(() => window.location.reload(), 3000);
    }

    function startAutoScroll() {
        if (scrollInterval) return;
        
        scrollInterval = setInterval(() => {
            if (!processingResponse && !isScrollingPaused) {
                autoScroll();
            }
        }, 2000);
    }

    function stopAutoScroll() {
        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null;
        }
    }

    function injectScript(filePath) {
        const container = document.head || document.documentElement;
        const scriptEl = document.createElement('script');
        scriptEl.src = chrome.runtime.getURL(filePath);
        scriptEl.type = 'text/javascript';
        container.appendChild(scriptEl);
        scriptEl.onload = () => {
            scriptEl.remove();
            // Start auto-scrolling after script loads
            startAutoScroll();
        };
        scriptEl.onerror = () => {
            console.error('Failed to load injector script');
            stopAutoScroll();
        };
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeStatusUI();
            injectScript('injector.js');
        });
    } else {
        initializeStatusUI();
        injectScript('injector.js');
    }

    // Updated message listener with better error handling
    window.addEventListener('message', (event) => {
        if (event.source !== window) return;
        
        const { type, data } = event.data;
        if (type === 'GROUP_POST') {
            processingResponse = true
            try {
                // console.log('📤 Content script sending message to background');
                
                if (!chrome.runtime) {
                    throw new Error('chrome.runtime not available');
                }

                // Ensure data exists and has required properties
                if (!data || !data.response) {
                    throw new Error('Invalid message data structure');
                }

                chrome.runtime.sendMessage({ type, data, timestamp: Date.now() })
                    .then(response => {
                        if (!response) {
                            throw new Error('No response from background script');
                        }

                        console.log('✅ Background response:', response.data.response);
                        
                        if (response.status === 'received' && response.data?.response) {
                            // Only scroll if we have valid data
                            autoScroll();
                        } else {
                            console.warn('⚠️ Unexpected response format:', response);
                        }
                    })
                    .catch(error => {
                        console.error('❌ Message handling error:', error);
                        // Only reload for specific errors
                        if (error.message.includes('chrome.runtime') || 
                            error.message.includes('No response')) {
                            reloadPage();
                        }
                    });

            } catch (error) {
                console.error('❌ Content script error:', error);
                // Don't reload for data structure errors
                if (error.message.includes('chrome.runtime')) {
                    reloadPage();
                }
            } finally {
                processingResponse = false
            }
        }
        
    });

    // Clean up on page unload
    window.addEventListener('unload', () => {
        document.removeEventListener('keydown', toggleScrolling);
        stopAutoScroll();
    });

})();