// Receive Message, Append to Popup
function getClassInfo() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "getCourse"}, function(response) {
      console.log(response);
      var para = document.createElement("p");
      para.textContent = response.name;
      document.getElementById("classes").appendChild(para);
    });
  });
}
// need a way for the array index of recently added course
// to be determined and messaged.
// or skip altogether and call loadPopupClasses();
// but it must be reworked to only append when course isn't already there


// Listener for Add Current Class
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('add-class').addEventListener('click', getClassInfo);
})

// load info into Popup DOM
function loadPopupClasses() {
  chrome.storage.local.get("output", function(output) {
      if(typeof output == "undefined") {
        console.error("Chrome Strorage undefined var");
      } else {
        var para = document.createElement("p");
        para.textContent = output.name;
        document.getElementById("classes").appendChild(para);
      }
  });
}

loadPopupClasses();


// take output/response, add new piece to global OBJ, commit obj to local storage,
// pull obj out of local storage, commit pieces to DOM
