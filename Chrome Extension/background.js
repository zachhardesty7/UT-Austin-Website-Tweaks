// Execute the inject.js in a tab and call a method,
// passing the result to a callback function.
function injectedMethod (tab, method, callback) {
  chrome.tabs.executeScript(tab.id, { file: 'inject.js' }, function(){
    chrome.tabs.sendMessage(tab.id, { method: method }, callback);
  });
}

function getClassInfo (tab) {
  // When we get a result back from the getBgColors
  // method, alert the data
  injectedMethod(tab, 'getClassInfo', function (response) {
    var classInfo = response.data;
    alert('Class Name: ' + classInfo.name);
    console.log(classInfo.name);
    return true;
  });
}

// When the browser action is clicked, call the
// getBgColors function.
chrome.browserAction.onClicked.addListener(getClassInfo);
