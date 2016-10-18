chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "getText"}, function(text) {
      var para = document.createElement("p");
      var element = document.getElementById("classes");
      console.log(text.name);
      para.innerHTML(text.name);
      element.appendChild(para);
    });
});
