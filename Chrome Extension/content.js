chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    if (message.type == 'getCourse') {
      collectCourseInfo();
      sendResponse(courseOutput);
    }
    return true;
  }
);

function collectCourseInfo() {
  var rawCourseData  = document.querySelectorAll("[data-th]");
  var courseName     = document.querySelector("#details h2").textContent;
  var courseUniqueID = rawCourseData.item(0).textContent;
  var courseDay      = rawCourseData.item(1).textContent;
  var courseTime     = rawCourseData.item(2).textContent;
  courseOutput = {
    uniqueID: courseUniqueID,
    name : courseName,
    day : courseDay,
    time : courseTime
  };

  // is the best way really to declare this variable
  // globally? better to just call function? make function return output?

  // locally store variable
  // chrome.storage.local.set(courses);
};
