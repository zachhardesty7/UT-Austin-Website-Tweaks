var ie4 = (document.all && !document.getElementById) ? true : false;
var ns4 = (document.layers) ? true : false;
var ie5 = (document.all && document.getElementById) ? true : false;
var ie6 = (navigator.userAgent.indexOf("MSIE 6") > 0) ? true : false;
var ns6 = (document.getElementById && !document.all) ? true : false;
var mac = (navigator.platform.indexOf("Mac") != -1) ? true : false;
var win = (navigator.platform.indexOf("Win") != -1) ? true : false;

function utd_openNPW(url,title,options) {
    if (arguments.length < 2)
        title = "";
    if (arguments.length < 3)
        options = "location=yes,menubar=yes,resizable=yes,scrollbars=yes,status=yes,toolbar=yes";
    window.open(url,title,options);
}


function confirmDelete (formName) { 
  confirmText = 'Are you sure you want to delete this?'; 
  deleteCheck = confirm(confirmText); 

  if (deleteCheck) { 
    formName.s_action.value='D'; 
    formName.submit(); 
  } 
} 

function updateDriver (formName) { 
  formName.s_action.value='U'; 
  formName.submit(); 
} 


function utd_submitSearch(formName) {
	
    if (formName.utd_searchOption[0].selected) {
        document.utdirectSearch.input_srch_string.value = formName.input_srch_string.value;
        document.utdirectSearch.submit();
    }
    else if (formName.utd_searchOption[1].selected) {
        document.utSearch.q.value = formName.input_srch_string.value;
        document.utSearch.submit();
    }
    else if (formName.utd_searchOption[2].selected) {
        document.directorySearch.q.value = formName.input_srch_string.value;
        document.directorySearch.submit();
    }
    else if (formName.utd_searchOption[3].selected) {
        document.webSearch.q.value = formName.input_srch_string.value;
        document.webSearch.submit();
    }
}
 
function utd_load() {
    top.window.frameHref = document.location.href;
}

function utd_unload() {
    top.window.frameHref=null;
}

function deleteConfirm(url) {
    if (confirm ('Are you sure you want to delete this service from your page?')) 
        document.location.href = url;
}

function utd_restorePortal() {
        alert ('This function is disabled in UT Direct Version 2.');
}

function checkEnter(event,formName) { 	
	var code = 0;
	code = event.keyCode;
	if (code==13) {
		utd_submitSearch(formName);
        return true;
    } else {
        return false;
    }
}