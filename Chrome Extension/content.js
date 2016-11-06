chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    if (message.type == 'getCourse') {
      sendResponse(courses);
    }
    return true;
  }
);

function collectCourseInfo() {
  var courseData  = document.querySelectorAll("[data-th]");
  var courseName     = document.querySelector("#details h2").textContent;
  var courseUniqueID = rawClassData.item(0).textContent;
  var courseDay      = rawClassData.item(1).textContent;
  var courseTime     = rawClassData.item(2).textContent;
  if (typeof courses === 'undefined') {
    courses = [];
  };
  courses.push({
    uniqueID: courseUniqueID,
    name    : courseName,
    day     : courseDay,
    time    : courseTime
  });

  // is the best way really to declare this variable
  // globally? better to just call function? make function return output?
  // locally store variable
  chrome.storage.local.set(courses);
};

collectCourseInfo();
