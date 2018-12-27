# Help us track the trackers
This is a Chrome extension that you can install to help us collect some data.

For now we just want to see a reasonable sized dataset to look at manually in order to make sure we have a good sense of which ad exchanges and ad creative servers exist in the wild so that we can build parsers for them. 

We will then modify the extension to be much more selective about what data it collects based on these findings. To see what data we collect, look below.

# Installation
You must use a Chrome browser.

1) Download this repository somewhere locally, i.e. type the following into a command line in a directory you work in
```
git clone git@github.com:CrowdDynamicsLab/RTBSpySimple.git
```
2) Open up chrome and type the following into the address bar
```
chrome://extensions
```
3) In the upper right of this page make sure developer mode is enabled
4) If it is, click on Load unpacked
5) Navigate to the **folder** containing the gihub repo you cloned abovein step 1

That's it. To remove the extension click remove.

# What it logs
It tracks and posts to a logging server all of the following information:

For every [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) we log url making the request, the url the request is made to, the response body, response headers, request headers, response type, request start time and request end time.

For every request your browser makes, if the response is an image of size greater than 1kb it logs the url of the image, the url of the page you were on when it was requested, the initiating url of the request, and the size of the image.

**It will log nothing at all when you are in private browsing mode** unless you explicitly enable this in Chrome (you shouldn't)