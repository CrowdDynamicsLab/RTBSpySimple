(function(xhr) {
    console.log("INJECTED")    
    var XHR = XMLHttpRequest.prototype;
    var open = XHR.open;
    var send = XHR.send;
    var setRequestHeader = XHR.setRequestHeader;

    XHR.open = function(method, url) {
        this._method = method;
        this._url = url;
        this._requestHeaders = {};
        this._startTime = (new Date()).toISOString();

        return open.apply(this, arguments);
    };

    XHR.setRequestHeader = function(header, value) {
        this._requestHeaders[header] = value;
        return setRequestHeader.apply(this, arguments);
    };

    XHR.send = function(postData) {
        this.addEventListener('load', function() {
            var endTime = (new Date()).toISOString();
            var myUrl = this._url ? this._url.toLowerCase() : this._url;
            if(myUrl) {
                if (postData) {
                    if (typeof postData === 'string') {
                        try {
                            // here you get the REQUEST HEADERS, in JSON format, so you can also use JSON.parse
                            this._requestHeaders = postData;    
                        } catch(err) {
                            console.error('Request Header JSON decode failed, transfer_encoding field could be base64');
                            console.log(err);
                        }
                    } else if (typeof postData === 'object' || typeof postData === 'array' || typeof postData === 'number' || typeof postData === 'boolean') {
                            // do something if you need
                    }
                }
                // here you get the RESPONSE HEADERS
                var responseHeaders = this.getAllResponseHeaders();                
                if ( this.responseType != 'blob' && this.responseType != 'arraybuffer' &&  myUrl  ) {
                    try {
                        var arr = this.responseText;    
                    }
                    catch(err) {
                        console.error("couldn't handle responseText")
                        console.log(this);
                    }                    
                    
                    // here you get RESPONSE TEXT (BODY), in JSON format, so you can use JSON.parse                        
                    try {
                        arr = JSON.parse(arr);
                    }
                    catch(err) {                        
                    }                        
                    var this_request = {
                        startTime: this._startTime,
                        responseType: this.responseType,
                        url: myUrl,
                        endTime: endTime,
                        requestHeaders: this._requestHeaders,
                        responseHeaders: responseHeaders,
                        responseBody: arr
                    };
                    var event = new CustomEvent('RTBSpyXHR', {
                            detail: {
                                response: JSON.stringify(this_request)
                            }
                        })
                    document.dispatchEvent(event);                                                                                                                            
                }

            }
        });

        return send.apply(this, arguments);
    };

})(XMLHttpRequest);