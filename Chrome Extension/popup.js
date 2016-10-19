function getClassInfo() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "getText"}, function(test1) {
      console.log(test1);
      console.log(12);
      // JSON.parse(text);
      var para = document.createElement("p");
      var element = document.getElementById("classes");
      // console.log(text.name);
      // para.innerHTML(text.name);
      // element.appendChild(para);
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('add-class').addEventListener('click', getClassInfo);
})

// response var text returns undefined
