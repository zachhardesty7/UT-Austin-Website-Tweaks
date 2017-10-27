// use built in button to hide if exists
function hideFeedbackModal() {
	let hideButton = document.querySelector('.ui-dialog .ui-dialog-buttonset button');
  if (hideButton) hideButton.click();
}

var observeDOM = (function() {
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
		eventListenerSupported = window.addEventListener;

	return function(obj, callback) {
		if (MutationObserver) {
			// define a new observer
			var obs = new MutationObserver(function(mutations, observer) {
				if (mutations[0].addedNodes.length || mutations[0].removedNodes.length)
					callback();
				}
			);
			// have the observer observe foo for changes in children
			obs.observe(obj, {
				childList: true,
				subtree: true
			});
		} else if (eventListenerSupported) {
			obj.addEventListener('DOMNodeInserted', callback, false);
			obj.addEventListener('DOMNodeRemoved', callback, false);
		}
	};
})();

// observe body for changes, if modal appears, hide
observeDOM(document.querySelector('body'), hideFeedbackModal);

// create loading gif, append where checkmark appears
function addLoadingIndicator() {
		let loading = document.createElement('img');
		loading.alt = 'loading';
		loading.src = 'http://www.mytreedb.com/uploads/mytreedb/loader/ajax_loader_gray_512.gif';
		loading.style = 'width: 25px';
		this.parentElement.parentElement.children[2].append(loading);
}

// make each submit button produce loading indicator
document.querySelectorAll('.feedback').forEach(button => {
	button.addEventListener('click', addLoadingIndicator);
})


/* for a future time, not likely to be worth pursuing
// noble attempt to load all quest pages - too much interaction

function getSlideIds() {
	Array.from(document.querySelectorAll('.small')[1].children).forEach(child => {
		// let id = child.match(/[0-9]+/)[0];
		// console.log( child.parentElement.innerHTML );
		child.parentElement.innerHTML.match(/[0-9]+/g).forEach(id => {
			console.log(id);
			appendSlide(id);
		})
	})
}

function appendSlide(id) {
	if (id) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", '/student/modulesessions/jump' + '?modulesessionitem=' + id, true);
		xhr.onload = function (e) {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					//console.log(xhr.responseText);
					document.querySelectorAll('.small')[1].innerHTML += xhr.responseText;
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
}

getSlideIds();

*/
