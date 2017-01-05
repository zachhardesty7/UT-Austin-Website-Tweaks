chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    switch (message.type) {
      case 'getCourse':
        collectCourseInfo();
        sendResponse(courseOutput);
        break;
      case 'exportCourse':
        exportCourseUniqueID(message.uniqueID);
        sendResponse("Success");
        break;
      default:
        return true;
    }
    return true;
  }
);

function collectCourseInfo() {
  let rawCourseData    = document.querySelectorAll('[data-th]');
  let courseName       = document.querySelector('#details h2').textContent;
  let courseUniqueID   = rawCourseData[0].textContent;
  let courseDay        = rawCourseData[1].textContent;
  let courseTime       = rawCourseData[2].textContent;
  let courseRoom       = rawCourseData[3].textContent;
  let courseInstructor = rawCourseData[4].textContent;
  let courseStatus     = rawCourseData[5].textContent;
  let courseFlags      = rawCourseData[6].textContent;
  // regex to clean up response (removes whitespace and \n or \t (new line and tab chars))
  courseFlags          = courseFlags.replace(/ {2,}|\n|\t/g, '');
  courseOutput = {
    uniqueID  : courseUniqueID,
    name      : courseName,
    day       : courseDay,
    time      : courseTime,
    room      : courseRoom,
    instructor: courseInstructor,
    status    : courseStatus,
    flags     : courseFlags
  };
  // is the best way really to declare this variable
  // globally? better to just call function? make function return output?
  // and run function (add ()) after send response
};

function exportCourseUniqueID(uniqueID) {
  console.log(uniqueID);
  document.getElementById('ds_request_STADD').checked = true;
  document.getElementById('s_unique_add').value = uniqueID;
}
