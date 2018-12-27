/**
 * code in inject.js
 * added "web_accessible_resources": ["injected.js"] to manifest.json
 */

sendMessage = function(event, data) {
	chrome.runtime.sendMessage({greeting: "hiya", event: event, data: data}, function(response) {
	  console.log(response.farewell);
	});
}

document.addEventListener("RTBSpyXHR", function(event) {
	//console.log("got a RTBSpyXHR event");
	var res = JSON.parse(event.detail.response);
	res.href = window.location.href;	
	sendMessage("RTBSpyXHR", res)
})

var s = document.createElement('script');
s.src = chrome.extension.getURL('injected_scripts/injected.js');	
s.onload = function() {	
    this.remove();
};
(document.head || document.documentElement).appendChild(s)

setTimeout(function() {
	var s = document.createElement('script');
	s.src = chrome.extension.getURL('injected_scripts/inject_bmi.js');	
	s.onload = function() {	
	    this.remove();
	};
	(document.head || document.documentElement).appendChild(s)
}, 5000)
