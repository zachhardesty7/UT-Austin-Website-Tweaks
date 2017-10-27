// FIXME
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	switch (message.type) {
		case 'exportCourse':
			exportCourseUniqueID(message.uniqueID);
			sendResponse("Success");
			break;
		default:
			return true;
	}
	return true;
});

// FIXME
function exportCourseUniqueID(uniqueID) {
	document.getElementById('ds_request_STADD').checked = true;
	document.getElementById('s_unique_add').value = uniqueID;
}

// inspiration from https://github.com/sid-kap/ut-course-registration/
// lazy loads all pages of courses immediately
// adds eval links on completion
(function() {
  'use strict';
  let nextPageURL = document.querySelector('#next_nav_link').href;

	// remove next / prev link buttons
	document.querySelector('#inner_body').children[1].remove();
	document.querySelector('#inner_body').children[2].remove();

	getNextPage(nextPageURL);
}());

// recursively retrieve and append all pages of courses
function getNextPage(url) {
	// initiate XHR request to load next page
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onload = function (e) {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				// remove superfluous spacing (minimify-ish)
				let page = xhr.responseText.replace(/(\s|&nbsp;)+/g, ' ');

				// select all courses (between tbody tags)
				let table = page.match(/<tbody> (.*) <\/tbody>/)[1];
				// append next page table to current table
				document.querySelector('.results tbody').innerHTML += table;

				// grab next page from the already next page string
				let nextURL = page.match(/prev<\/a> <a href="(.*?)" id="next_nav_link"/);
				// if there is another page, recursively call self w URL
				if (nextURL) {
					getNextPage(location.protocol+'//'+location.hostname+location.pathname+nextURL[1]);
				} else {
					addEvalLinks();
					createCourseToExtensionButtons();
				}
			} else {
				console.error(xhr.statusText);
			}
		}
	};
	xhr.onerror = function (e) {
		console.error(xhr.statusText);
	};
	xhr.send(null);
}

// insipiration from https://github.com/ethanperez/TexReg
// get data from uri param
// Courtesy of http://www.sitepoint.com/url-parameters-jquery/
function getURIParam(key) {
	let results = new RegExp('[\?&]' + key + '=([^&#]*)').exec(window.location.href);
	if (results == null) {
		return null;
	} else {
		return results[1] || 0;
	}
}

// add links to instructor evals / syllabus
function addEvalLinks() {
	let dept = getURIParam('fos_fl');

	// add link to instructor page
	document.querySelectorAll('td.course_header h2').forEach(header => {
		// match specific 3 digit course and letters after
		let courseNumber = header.textContent.match(/\d{3}\S*/)[0];
		// create link and append to header
		let headerLink = document.createElement('a');
		headerLink.href = 'https://utdirect.utexas.edu/apps/student/coursedocs' +
			'/nlogon/?semester=&department=' + dept + '&course_number=' + courseNumber + '&course_title=&unique=&instructor_first=&instructor_last=' + '&course_type=In+Residence&search=Search';
		headerLink.target = '_blank';
		headerLink.textContent = 'View Syllabi and CVs'
		header.append(' | ');
		header.append(headerLink);
	});

	// Capitalizes the beginning of each word
	// http://stackoverflow.com/questions/4878756
	// /javascript-how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
	String.prototype.capitalize = function() {
		return this.replace(/(^|\s)([a-z])/g, function(m, p1, p2) {
			return p1 + p2.toUpperCase();
		});
	};

	// Add link to CIS below prof name
	document.querySelectorAll('td[data-th="Instructor"]').forEach(instructor => {
		let plainUriName = instructor.textContent.toLowerCase().capitalize();
		if (plainUriName !== "") {
			// Get the prof's URI
			let uriName = encodeURIComponent(plainUriName).replace(/%20/, '+');
			let surveyLink = document.createElement('a');
			surveyLink.href = 'https://utdirect.utexas.edu/ctl/ecis/results' +
				'/search.WBX?s_in_search_type_sw=N&s_in_max_nbr_return=10&' +
				's_in_search_name=' + uriName;
			surveyLink.target = '_blank';
			surveyLink.textContent = 'Surveys';

			// Change the name into a link
			instructor.append(document.createElement('br'));
			instructor.append('(');
			instructor.append(surveyLink);
			instructor.append(' / ');
		}
	});

	var header;
	// Add syllabus link
	Array.from(document.querySelector('.results tbody').children).forEach(row => {
		if (row.firstElementChild.className === 'course_header') {
			header = row.firstElementChild.firstElementChild.textContent;
		} else {
			// Set the prof's name
			let profName = row.children[4].textContent;
			if (profName !== "") {
				let syllabusLink = document.createElement('a');
				syllabusLink.href = 'https://utdirect.utexas.edu/apps/student/coursedocs' +
					'/nlogon/?semester=&department=' + dept + '&course_number=' + header.match(/\d{3}\S*/)[0] + '&course_title=&unique=&instructor_first=&instructor_last=' + profName.split(", ")[0] + '&course_type=In+Residence&search=Search';
				syllabusLink.target = '_blank';
				syllabusLink.textContent = 'Syllabi'

				row.children[4].append(syllabusLink);
				row.children[4].append(')');
			}
		}
	});
}

function collectCourseHeaderData(headerRow) {
	let courseData = {};
	let headerRowData = parseHeaderRow(headerRow);
	courseData.dept = headerRowData[0];
	courseData.code = headerRowData[1];
	courseData.title = headerRowData[2];

	return courseData;
}

function collectCourseData(courseRow) {
	let courseData = {};
	// match 5 digit course uniqueID only
	courseData.unique = courseRow.children[0].textContent.match(/\d{5}/)[0];
	// match everything before "(" in my survery link addition
	courseData.instructor = courseRow.children[4].textContent.match(/.*(?=\()/)[0];
	// ignore restricted info (for now - TODO)
	courseData.status = courseRow.children[5].textContent.match(/\w*|/)[0];
	// remove superfluous spacing
	courseData.flag = courseRow.children[6].textContent.replace(/ {2,}|\n|\t/g, '');

	courseData.events = [];
	// split folling into capture groups
	let days = courseRow.children[1].textContent.match(/[A-Z]+/g);
	let times = courseRow.children[2].textContent.match(/\d+:\d+ [a,p]\.m./g);
	let rooms = courseRow.children[3].textContent.match(/\w{3} \d.\d+/g);

	// select certain matches
	for (let i = 0; i < days.length; i++) {
		let event = {};
		event.day = days[i];
		event.start = times[i * 2];
		event.end = times[i * 2 + 1];
		event.room = rooms[i];
		courseData.events.push(event);
	}

	return courseData;
}

function parseHeaderRow(node) {
	// black magic, splits header into array [dept, num, title]
	return node.textContent.match(/^(\w{3}|\w\s\w)|(\d{3}\S*)|\S+(?: \S+)*(?=.+\|.*\|)/g);
	// if syllabi link disabled .match(/^(\w{3}|\w\s\w)|(\d{3}\S*)|\S+(?: \S+)*(?=.+\|)/g)
}

function courseToExtension() {
	let courseRow = this.parentElement.parentElement;
	let rows = Array.from(document.querySelector('.results tbody').children);
	let courseRowIndex = rows.indexOf(courseRow);
	// loop backwards from current row until you hit a header
	for (let i = courseRowIndex; i >= 0; i--) {
		if (rows[i].firstElementChild.className === 'course_header') {
			var courseData = collectCourseHeaderData(rows[i].firstElementChild.firstElementChild);
			break;
		}
	}
	courseData.classes = [];
	courseData.classes.push(collectCourseData(this.parentElement.parentElement, courseData));

	chrome.runtime.sendMessage({
			type: "updateCoursesArray",
			add: true,
			courseData: courseData
		},
	);
}

function allCoursesToExtension() {
	let headerRow = this.parentElement.parentElement;

	// get data from selected headerRow - dept, num, title
	let rows = Array.from(document.querySelector('.results tbody').children);
	let headerRowIndex = rows.indexOf(headerRow.parentElement);
	let courseData = collectCourseHeaderData(headerRow);

	// add all classes until next header row
	courseData.classes = [];
	for (let i = headerRowIndex + 1; rows[i].firstElementChild.className !== 'course_header'; i++) {
		courseData.classes.push(collectCourseData(rows[i], courseData));
	}
	chrome.runtime.sendMessage({
			type: "updateCoursesArray",
			add: true,
			courseData: courseData
		},
	);
}

function createCourseToExtensionButtons() {
	Array.from(document.querySelector('.results tbody').children).forEach(row => {
		if (row.firstElementChild.className === 'course_header') {
			let addCourse = document.createElement('a');
			addCourse.className = 'course-header-button';
			addCourse.textContent = 'Add Course';

			// TODO: better solution to get blue link and orange hover
			addCourse.href = 'javascript:';

			row.firstElementChild.firstElementChild.append(' | ');
			row.firstElementChild.firstElementChild.append(addCourse);
		} else {
			let addCourse = document.createElement('a');
			addCourse.className = 'course-button';
			addCourse.textContent = '(Add Course)';
			// TODO: better solution to get blue link and orange hover
			addCourse.href = 'javascript:';
			row.firstElementChild.append(document.createElement('br'));
			row.firstElementChild.append(addCourse);
		}
	});
	document.querySelectorAll('.course-header-button').forEach(button => {
		button.addEventListener('click', allCoursesToExtension);
	})
	document.querySelectorAll('.course-button').forEach(button => {
		button.addEventListener('click', courseToExtension);
	})
}

// Course Data Format //

/*
course = {
	dept: "ARA"
	code: "601C"
	title: "INTENSIVE ARABIC I"
	classes: [{
		unique: "41155"
		instructor: "EL BAROUNI, RADWA M"
		flags: ""
		status: "closed"
		events: [{
			day: MWF,
			start: 10:00 a.m,
			end: 11:00 a.m.
			room: MEZ 1.102,
		}, {
			day: TTH,
			start: 10:00 a.m,
			end: 11:00 a.m.
			room: MEZ 1.122,
		}],
	{
		unique: "41160"
		instructor: "EL BAROUNI, RADWA M"
		flags: ""
		status: "closed"
		events: [{
			day: MWF,
			start: 10:00 a.m,
			end: 11:00 a.m.
			room: MEZ 1.102,
		}, {
			day: TTH,
			start: 10:00 a.m,
			end: 11:00 a.m.
			room: MEZ 1.122,
		}]
	}]
}
*/
