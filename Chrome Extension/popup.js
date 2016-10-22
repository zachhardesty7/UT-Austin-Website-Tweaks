function getClassInfo() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "getClass"}, function(response) {
      
      console.log(response);
      var para = document.createElement("p");
      para.textContent = response.name;
      document.getElementById("classes").appendChild(para);
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('add-class').addEventListener('click', getClassInfo);
})
