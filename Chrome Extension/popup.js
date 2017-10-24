// send message to wipe courses and reload DOM
function clearCoursesArray() {
  chrome.runtime.sendMessage({
      type: "updateCoursesArray",
      set: []
    },
    function(response) {
      reloadPopupCourses(response.courses)
    }
  );
}

// clears courses and loads new courses into DOM
function reloadPopupCourses(coursesArray) {
  // clear current course list
  // FIXME: accidentally deletes 'Added Courses' heading
  let popupCourses = document.querySelector('#courses ul');
  while (popupCourses.firstChild) {
    popupCourses.removeChild(popupCourses.firstChild);
  }

  // load course info into popup DOM
  if (coursesArray.length) {
    coursesArray.forEach(course => {
      course.classes.forEach((classInstance, ind) => {
        // build course container and name
        let listCourseLi = document.createElement('li');
        listCourseLi.className = 'collection-item';
        let listCourseDiv = document.createElement('div');
        if (courses != 'null') listCourseDiv.setAttribute('data-unique', classInstance.unique);
        if (classInstance.status === 'closed') listCourseLi.className += ' grey lighten-2';
        listCourseDiv.textContent = course.unique + ' ' + course.dept + ' ' + course.code + ' ' + course.title;

        // build delete course icon
        let listDeleteSpan = document.createElement('div');
        listDeleteSpan.className = 'icon-delete';
        let listDelete = document.createElement('i');
        listDelete.className = 'material-icons';
        listDelete.textContent = 'close';

        // build export course icon
        let listExportSpan = document.createElement('div');
        listExportSpan.className = 'icon-export';
        let listExport = document.createElement('i');
        listExport.className = 'material-icons';
        listExport.textContent = 'launch';

        // append newly created course row
        let selection = document.querySelector('#courses ul');
        listCourseDiv.appendChild(listDeleteSpan).appendChild(listDelete);
        listCourseDiv.appendChild(listExportSpan).appendChild(listExport);
        selection.appendChild(listCourseLi).appendChild(listCourseDiv);

        // add handler to icons
        document.querySelectorAll('.icon-delete')[ind].addEventListener('click', deletePopupCourse);
        document.querySelectorAll('.icon-export')[ind].addEventListener('click', exportPopupCourse);
      })

    })
  }
}

// delete individual course (deletes all matching unique's)
function deletePopupCourse() {
  chrome.runtime.sendMessage({
      type: "updateCoursesArray",
      del: this.parentNode.getAttributeNode("data-unique").value
    },
    function(response) {
      reloadPopupCourses(response.courses)
    }
  );
}

// inactive function
function exportPopupCourse() {
  let unique = this.parentNode.getAttributeNode("data-unique").value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: 'exportCourse', unique: unique}, function(response) {
      console.log(response);
    });
  });
}

// TODO: GCAL integration
// callback = function (error, httpStatus, responseText);
function authenticatedXhr(method, url, callback) {
  var retry = true;
  function getTokenAndXhr() {
    chrome.identity.getAuthToken({/* details */},
                                 function (access_token) {
      if (chrome.runtime.lastError) {
        callback(chrome.runtime.lastError);
        return;
      }

      var xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.setRequestHeader('Authorization',
                           'Bearer ' + access_token);

      xhr.onload = function () {
        if (this.status === 401 && retry) {
          // This status may indicate that the cached
          // access token was invalid. Retry once with
          // a fresh token.
          retry = false;
          chrome.identity.removeCachedAuthToken(
              { 'token': access_token },
              getTokenAndXhr);
          return;
        }

        callback(null, this.status, this.responseText);
      }
    });
  }
}


      /**
      *  Called when the signed in status changes, to update the UI
      *  appropriately. After a sign-in, the API is called.
      */
      function updateSigninStatus(isSignedIn) {
        var authorizeButton = document.getElementById('authorize-button');
        var signoutButton = document.getElementById('signout-button');
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
          // could be useful soon
          // listUpcomingEvents();
          createEvent();
        } else {
          authorizeButton.style.display = 'block';
          signoutButton.style.display = 'none';
        }
      }



      /**
      *  Sign in the user upon button click.
      */
      function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
      }

      /**
      *  Sign out the user upon button click.
      */
      function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
      }

      /**
      * Append a pre element to the body containing the given message
      * as its text node. Used to display the results of the API call.
      *
      * @param {string} message Text to be placed in pre element.
      */
      function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }

      function createEvent() {
        var event = {
          'summary': 'Google I/O 2015',
          'location': '800 Howard St., San Francisco, CA 94103',
          'description': 'A chance to hear more about Google\'s developer products.',
          // 'id': 'zhcal123456',
          'start': {
            'dateTime': '2017-10-09T09:00:00-07:00',
            'timeZone': 'America/Chicago'
          },
          'end': {
            'dateTime': '2017-10-09T17:00:00-07:00',
            'timeZone': 'America/Chicago'
          },
          'recurrence': [
					'RRULE:FREQ=DAILY;COUNT=2'
          ],
        };

        var request = gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': event
        });

        request.execute(function(event) {
          appendPre('Event created: ' + event.htmlLink);
        });
      }



// Listener for Add Current Class & load courses
document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('#exportToGCal').addEventListener('click', exportToGCal);
  document.querySelector('#clear-courses').addEventListener('click', clearCoursesArray);
  
  // load classes for initial display in popup DOM
  chrome.runtime.sendMessage({
      type: "updateCoursesArray",
    },
    function(response) {
      reloadPopupCourses(response.courses);
    }
  );
});
