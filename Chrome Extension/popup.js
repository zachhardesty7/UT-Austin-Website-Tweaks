// Receive Message, Append to Popup
function getCourseInfo() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: 'getCourse'}, function(response) {
      // error check for null local storage array then write to chrome local storage
      let coursesArray = [];
      if (getArrayInLocalStorage('courses')) {
        coursesArray = getArrayInLocalStorage('courses');
      }
      // TODO: implement func to prevent duplicate courses being added
      // if (courses[i].uniqueID === response.uniqueID) {}
      coursesArray.push(response);
      setArrayInLocalStorage('courses', coursesArray);
      clearPopupCourses();
      loadPopupCourses();
    });
  });
}

// wipe popup and local storage
function clearCoursesArray() {
  let coursesArray = [];
  setArrayInLocalStorage('courses', coursesArray);
  clearPopupCourses();
}

// local storage array func helpers
function setArrayInLocalStorage(key, array) {
    localStorage.setItem(key, JSON.stringify(array));
}

function getArrayInLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

// load info into Popup DOM
function loadPopupCourses() {
  if (getArrayInLocalStorage('courses')) {
    for (let i = 0; i < getArrayInLocalStorage('courses').length; i++) {
      let coursesArray = getArrayInLocalStorage('courses');

      let listCourse = document.createElement('p');
      listCourse.setAttribute('data-uniqueid', coursesArray[i].uniqueID);
      listCourse.textContent = coursesArray[i].name;

      let listSpan = document.createElement('div');
      listSpan.className = 'icon-delete';

      let listIcon = document.createElement('i');
      listIcon.className = 'fa fa-pull-right fa-times fa-fw';

      document.getElementById('courses').appendChild(listCourse);
      document.getElementById('courses').childNodes[i].appendChild(listSpan);
      document.getElementById('courses').childNodes[i].childNodes[1].appendChild(listIcon);

      // REVIEW: WTF, HOW DOES THIS WORK
      // duplicative event handles (popupCourses) added here
      document.querySelectorAll('.icon-delete')[i].addEventListener('click', deletePopupCourse);
    }
  }
}

function clearPopupCourses() {
  let popupCourses = document.getElementById('courses');
  while (popupCourses.firstChild) {
    popupCourses.removeChild(popupCourses.firstChild);
  }
}

// delete individual course (deletes all matching uniqueID's)
function deletePopupCourse() {
  this.parentNode.parentNode.removeChild(this.parentNode)

  // handle array splicing
  let key = this.parentNode.getAttributeNode("data-uniqueid").value //.attributes[0].value is valid
  let coursesArray = getArrayInLocalStorage('courses');
  for (let i = coursesArray.length - 1; i >= 0; i--) {
    if (coursesArray[i].uniqueID === key) {
      coursesArray.splice(i, 1);
    }
  }
  setArrayInLocalStorage('courses', coursesArray);

  // TODO: probably easier to combine into reloadPopupCourses();
  clearPopupCourses();
  loadPopupCourses();
}

// first analyze how form filler does dynamic lists
// create function to reassign HTML ids
// can be called whenever individual courses are deleted or moved
// fuck the above. use data-* instead of custom ids

// Listener for Add Current Class & load courses
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('add-course').addEventListener('click', getCourseInfo);
  document.getElementById('clear-courses').addEventListener('click', clearCoursesArray);
  loadPopupCourses();

  // REVIEW: WTF, HOW DOES THIS NOT WORK
  // for (i = 0; i < document.querySelectorAll('.icon-delete').length; i++) {
    // document.querySelectorAll('.icon-delete')[i].addEventListener('click', deletePopupCourse);
  // }
});
