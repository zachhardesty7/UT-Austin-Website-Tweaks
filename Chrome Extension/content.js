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
  let rawCourseData    = document.querySelectorAll('[data-th]');
  let courseName       = document.querySelector('#details h2').textContent;
  let courseUniqueID   = rawCourseData[0].textContent;
  let courseDay        = rawCourseData[1].textContent;
  let courseTime       = rawCourseData[2].textContent;
  let courseRoom       = rawCourseData[3].textContent;
  let courseInstructor = rawCourseData[4].textContent;
  let courseStatus     = rawCourseData[5].textContent;
  // TODO: parse to remove wasted space / convert to more readable symbol
  let courseFlags      = rawCourseData[6].textContent;
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
