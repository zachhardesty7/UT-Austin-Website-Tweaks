// Receive Message, Append to Popup
function getCourseInfo() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: 'getCourse'}, function(response) {
      // error check for null local storage array then write to chrome local storage
      let coursesArray = [];
      if (getArrayInLocalStorage('courses').length) {
        coursesArray = getArrayInLocalStorage('courses');
      }
      // TODO: implement func to prevent duplicate courses being added
      // if (courses[i].uniqueID === response.uniqueID) {}
      coursesArray.push(response);
      setArrayInLocalStorage('courses', coursesArray);
      reloadPopupCourses();
    });
  });
}

// wipe popup and local storage
function clearCoursesArray() {
  let coursesArray = [];
  setArrayInLocalStorage('courses', coursesArray);
  reloadPopupCourses();
}

// local storage array func helpers
function setArrayInLocalStorage(key, array) {
  localStorage.setItem(key, JSON.stringify(array));
}

function getArrayInLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

function reloadPopupCourses() {
  // clear current course list
  let popupCourses = document.getElementById('courses');
  while (popupCourses.firstChild) {
    popupCourses.removeChild(popupCourses.firstChild);
  }

  // load course info into popup DOM
  if (getArrayInLocalStorage('courses').length) {
    for (let i = 0; i < getArrayInLocalStorage('courses').length; i++) {
      let coursesArray = getArrayInLocalStorage('courses');

      let listCourse = document.createElement('p');
      listCourse.setAttribute('data-uniqueid', coursesArray[i].uniqueID);
      listCourse.textContent = coursesArray[i].name;

      let listDeleteSpan = document.createElement('div');
      listDeleteSpan.className = 'icon-delete';

      let listDelete = document.createElement('i');
      listDelete.className = 'fa fa-pull-right fa-times fa-fw';

      let listExportSpan = document.createElement('div');
      listExportSpan.className = 'icon-export';

      let listExport = document.createElement('i');
      listExport.className = 'fa fa-pull-right fa-share fa-fw';

      document.getElementById('courses').appendChild(listCourse);
      document.getElementById('courses').childNodes[i].appendChild(listDeleteSpan);
      document.getElementById('courses').childNodes[i].appendChild(listExportSpan);
      document.getElementById('courses').childNodes[i].childNodes[1].appendChild(listDelete);
      document.getElementById('courses').childNodes[i].childNodes[2].appendChild(listExport);

      // REVIEW: WHY DOES THIS WORK here but not outside of it
      // duplicative event handles (popupCourses) added here
      document.querySelectorAll('.icon-delete')[i].addEventListener('click', deletePopupCourse);
      document.querySelectorAll('.icon-export')[i].addEventListener('click', exportPopupCourse);
    }
  }
}

// delete individual course (deletes all matching uniqueID's)
function deletePopupCourse() {
  this.parentNode.parentNode.removeChild(this.parentNode)

  // handle array splicing
  let key = this.parentNode.getAttributeNode("data-uniqueid").value; //.attributes[0].value is valid
  let coursesArray = getArrayInLocalStorage('courses');
  for (let i = coursesArray.length - 1; i >= 0; i--) {
    if (coursesArray[i].uniqueID === key) {
      coursesArray.splice(i, 1);
    }
  }
  setArrayInLocalStorage('courses', coursesArray);
  reloadPopupCourses();
}

function exportPopupCourse() {
  let uniqueID = this.parentNode.getAttributeNode("data-uniqueid").value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: 'exportCourse', uniqueID: uniqueID}, function(response) {
      console.log(response);
    });
  });
}

// Listener for Add Current Class & load courses
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('add-course').addEventListener('click', getCourseInfo);
  document.getElementById('clear-courses').addEventListener('click', clearCoursesArray);
  reloadPopupCourses();

  // REVIEW: WTF, HOW DOES THIS NOT WORK
  // for (i = 0; i < document.querySelectorAll('.icon-delete').length; i++) {
    // document.querySelectorAll('.icon-delete')[i].addEventListener('click', deletePopupCourse);
  // }
});
