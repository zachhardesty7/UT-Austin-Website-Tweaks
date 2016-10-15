// This helps avoid conflicts in case we inject
// this script on the same page multiple times
// without reloading.
var injected = injected || (function() {

  // An object that will contain the "methods"
  // we can use from our event script.
  var methods = {};

  // This method will eventually return
  // background colors from the current page.
  methods.getClassInfo = function() {
    var nodes = document.querySelectorAll('[data-th]');
    var info = {
      uniqueID: nodes.item(0),
      name: document.querySelector("#details h2"),
      time: nodes.item(2)
    };
    return Object.getOwnPropertyDescriptors(info);
  };

  // This tells the script to listen for
  // messages from our extension.
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var data = {};
    // If the method the extension has requested
    // exists, call it and assign its response
    // to data.
    if (methods.hasOwnProperty(request.method))
      data = methods[request.method]();
    // Send the response back to our extension.
    sendResponse({
      data: data
    });
    return true;
  });

  return true;
})();



// function getClassInfo(){
//   var classes = document.querySelectorAll("[data-th]");
//   var uniqueID = classes.item(0); //.innerHTML
//   var name = document.querySelector("#details h2")
//   var time = classes.item(2);
//   var para = document.createElement("p");
//   var node = document.createTextNode(uniqueID + name + time);
//   para.appendChild(node);
//   var element = document.getElementById("classes");
//   element.appendChild(para)
// }
