(function FrappeInjector() {
    // Store original methods
    const original = {
        xhr: {
            open: XMLHttpRequest.prototype.open,
            send: XMLHttpRequest.prototype.send
        },
        fetch: window.fetch
    };

    // Helper function to parse multi-JSON response
    function parseMultipleJSON(rawString) {
        try {
            const cleanString = rawString.toString().trim();
            const jsonStrings = cleanString.split('\n').filter(str => str.trim());
            return jsonStrings.map(str => JSON.parse(str));
        } catch (e) {
            console.error('Frappe: Failed to parse multi-JSON:', e);
            console.log('Raw string type:', typeof rawString);
            console.log('Raw string value:', rawString);
            return null;
        }
    }

    // XHR override
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        if (method === 'POST' && url.includes('graphql')) {
            this._frappeData = { method, url };
            this.addEventListener('load', function() {
                // Only process response if we stored a matching request body
                if (this.responseText && this._frappeRequestBody) {
                    try {
                        // Convert responseText to string explicitly
                        const responseString = String(this.responseText);
                        const parsedResponse = parseMultipleJSON(responseString);
                        
                        if (parsedResponse) {
                            window.postMessage({
                                type: 'GROUP_POST',  // Changed from FRAPPE_DATA to GROUP_POST
                                data: {
                                    id: Date.now(),
                                    url: this._frappeData.url,
                                    method: this._frappeData.method,
                                    requestBody: this._frappeRequestBody,
                                    response: parsedResponse,
                                    timestamp: new Date().toISOString()
                                }
                            }, '*');
                        }
                    } catch (e) {
                        console.error('Frappe: Failed to process response:', e);
                        console.log('Response type:', typeof this.responseText);
                        console.log('Raw response:', this.responseText);
                    }
                }
            });
        }
        return original.xhr.open.apply(this, [method, url, ...args]);
    };

    XMLHttpRequest.prototype.send = function(body) {
        if (this._frappeData && body) {
            try {
                const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
                // Only store request body if it matches our criteria
                if (bodyStr.includes('GroupsCometFeedRegularStoriesPaginationQuery')) {
                    this._frappeRequestBody = bodyStr;
                }
            } catch (e) {
                console.error('Frappe: Failed to process request body', e);
            }
        }
        return original.xhr.send.call(this, body);
    };

    window.frappe = { initialized: true };
})();
