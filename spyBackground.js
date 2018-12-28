/******************************
 *** Temporary data storage ***
 ******************************/
var xhr = [] // xhr requests
var imgs = [] // images and scripts


/*******************************
 *** Listen for web requests ***
 *******************************/
var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};

chrome.webRequest.onCompleted.addListener(function(details) {  

  // ignore our post requests
  if(details.url.includes("rtbbackend.herokuapp.com")) {
    return;
  }
  // ignore anything that's not an image
  if(details.type != 'image') {
    return;
  }  
  // ignore tracking pixels
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    var urlHost = getLocation(url).hostname.split('.').slice('1').join('.')
    var detailsurlHost = getLocation(details.url).hostname.split('.').slice('1').join('.')

    console.log(url)
    console.log(urlHost)
    console.log(details.url)
    console.log(detailsurlHost)
    if(urlHost == detailsurlHost) {
      console.log('ignoring')
      return;
    }
    var lngth = 0;
    
    
    for(var i = 0; i < details.responseHeaders.length; i++) {
      var header = details.responseHeaders[i];
      if(header.name == 'content-length') {
        try {
          lngth = parseInt(header.value)
        } catch(err) {
          console.error("error parsing content-length, value below")
          console.log(header.value)
        }
      }                                
    }    
    if(lngth > 1000) {
      var img_data = {
        href: url,
        initiator: details.initiator,
        url: details.url,
        sz: lngth,
        timestamp: Date.now()

      }
      //console.log(img_data)
      //console.log(details)
      imgs.push(img_data)  
    }
  });
    
  
  
}, {urls: ["<all_urls>"]}, ["responseHeaders"])



/***************************
 *** Event listener code ***
 ***************************/
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    	/*console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension"); */
    if (request.greeting == "hiya")
    	if(request.event == "RTBSpyXHR") {
        //console.log("xhr event")
        //console.log(request.data)
    		xhr.push(request.data);
    	}    	
      else {
        console.log("uncaught event "+request.event)
      }
      sendResponse({farewell: "goodbye"});
  });



/****************************
 *** Code for saving data ***
 ****************************/
// Thanks: https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

var periodicSave = function() {	
	var temporary_xhr = xhr;		
  var temporary_imgs = imgs;
	$.post('https://rtbbackend.herokuapp.com/xhr', {"xhr": JSON.stringify(temporary_xhr)}).done(data => {
		if(!arraysEqual(temporary_xhr, xhr)) {
			console.log('uh oh, xhr has been updated')
			console.log('xhr')
			console.log(xhr)
			console.log('temporary_xhr')
			console.log(temporary_xhr)
		}
    if(data.status != 'ok') {
      console.log('problem with posting to xhr backend')
      console.log(data)
    } else {
      xhr = [];    
    }		
	}, "json");		
  $.post('https://rtbbackend.herokuapp.com/imgs', {"imgs": JSON.stringify(temporary_imgs)}).done(data => {
    if(!arraysEqual(temporary_imgs, imgs)) {
      console.log('uh oh, imgs has been updated')
      console.log('imgs')
      console.log(imgs)
      console.log('imgs')
      console.log(imgs)
    }
    if(data.status != 'ok') {
      console.log('problem with posting to images backend')
      console.log(data)
    } else {
      imgs = [];    
    }
      
  }, "json");   			
	setTimeout(periodicSave, 10000);
}

setTimeout(periodicSave, 10000);