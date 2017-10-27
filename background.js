// TODO: GCAL integration
chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
  // Use the token.
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // listen for messages that update stored courses
    if (request.type === 'updateCoursesArray') {
      // set to value
      if (request.set) {
        setArrayInLocalStorage('courses', request.set);

      // delete certain unique
      } else if (request.del) {
        // handle array splicing
        let courses = getArrayInLocalStorage('courses');
        courses.forEach((course, i) => {
          course.classes.forEach((obj, j) => {
            if (obj.unique === request.del) {
              course.classes.splice(j, 1);
              if (!obj) course.splice(i, 1)
              setArrayInLocalStorage('courses', courses);
            }
          })
        })

      // add unique to storage
      } else if (request.add) {
        let courses = getArrayInLocalStorage('courses');
        courses.push(request.courseData);
        setArrayInLocalStorage('courses', courses);
      }

      // send back updated coursesArray
      sendResponse({
        courses: getArrayInLocalStorage('courses')
      });
    }
  return true;
  }
);


// local storage array func helpers
function setArrayInLocalStorage(key, array) {
  localStorage.setItem(key, JSON.stringify(array));
}

function getArrayInLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
