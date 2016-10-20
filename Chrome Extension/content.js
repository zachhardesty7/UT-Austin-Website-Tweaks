chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        if (message.type == 'getClass') {
          sendResponse(output);
        }
        return true;
    }
);

function collectClassInfo() {
  var classes = document.querySelectorAll("[data-th]");
  var uniqueID = classes.item(0).textContent; //.innerHTML
  var name = document.querySelector("#details h2").textContent;
  var time = classes.item(2).textContent;
  output = {
    uniqueID : uniqueID,
    name : name,
    time : time
  }
}

collectClassInfo();



// var elements = document.getElementsByTagName('*');
// var count = 0;
//
// function tokeCounter(){
//     for (var i = 0; i < elements.length; i++) {
//         var element = elements[i];
//
//         for (var j = 0; j < element.childNodes.length; j++) {
//             var node = element.childNodes[j];
//
//             if (node.nodeType === 3) {
//                 var text = node.nodeValue;
//                 if(text == '420'){
//                     count++;
//                 }
//
//                 var replacedText = text.replace(/420/, '+1');
//
//                 if (replacedText !== text) {
//                     element.replaceChild(document.createTextNode(replacedText), node);
//                 }
//             }
//         }
//     }
// }
//
// tokeCounter();
