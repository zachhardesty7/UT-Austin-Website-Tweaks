// Inform the background page that
// this tab should have a page-action
chrome.runtime.sendMessage({
  from:    'content',
  subject: 'showPageAction'
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  // First, validate the message's structure
  if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
    // Collect the necessary data
    // (For your specific requirements `document.querySelectorAll(...)`
    //  should be equivalent to jquery's `$(...)`)
    var domInfo = {
      total:   document.querySelectorAll('*').length,
      inputs:  document.querySelectorAll('input').length,
      buttons: document.querySelectorAll('button').length
    };

    // Directly respond to the sender (popup),
    // through the specified callback */
    response(domInfo);
  }
});



// // This helps avoid conflicts in case we inject
// // this script on the same page multiple times
// // without reloading.
// var injected = injected || (function() {
//
//   // An object that will contain the "methods"
//   // we can use from our event script.
//   var methods = {};
//
//   // This method will eventually return
//   // background colors from the current page.
//   methods.getClassInfo = function() {
//     var nodes = document.querySelectorAll('[data-th]');
//     var info = {
//       uniqueID: nodes.item(0),
//       name: document.querySelector("#details h2"),
//       time: nodes.item(2)
//     };
//     return Object.getOwnPropertyDescriptors(info);
//   };
//
//   // This tells the script to listen for
//   // messages from our extension.
//   chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     var data = {};
//     // If the method the extension has requested
//     // exists, call it and assign its response
//     // to data.
//     if (methods.hasOwnProperty(request.method))
//       data = methods[request.method]();
//     // Send the response back to our extension.
//     sendResponse({
//       data: data
//     });
//     return true;
//   });
//
//   return true;
// })();
