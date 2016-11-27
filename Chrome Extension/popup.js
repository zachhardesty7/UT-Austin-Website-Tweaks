// Receive Message, Append to Popup
function getCourseInfo() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "getCourse"}, function(response) {
      // check then write to chrome local storage
      var courses = [];
      if (getArrayInLocalStorage('courses')) {
        courses = getArrayInLocalStorage('courses');
      }
      courses.push(response);
      setArrayInLocalStorage('courses', courses);

      // Append new course
      var para = document.createElement("p");
      para.textContent = response.name;
      document.getElementById('courses').appendChild(para);
    });
  });
}

// wipe popup and local storage
function clearCourses() {
  var courses = [];
  setArrayInLocalStorage('courses', courses);
  var popupCourses = document.getElementById('courses');
  while (popupCourses.firstChild) {
    popupCourses.removeChild(popupCourses.firstChild);
  }
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
    for (var i = 0; i < getArrayInLocalStorage("courses").length; i++) {
      var courses = getArrayInLocalStorage('courses');
      var para = document.createElement("p");
      para.textContent = courses[i].name;
      document.getElementById('courses').appendChild(para);
    }
  }
}

// Listener for Add Current Class & load courses
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('add-course').addEventListener('click', getCourseInfo);
  document.getElementById('clear-courses').addEventListener('click', clearCourses);
  loadPopupCourses();
})
