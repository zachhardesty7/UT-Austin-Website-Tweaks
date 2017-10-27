// TODO: Attempt method to remove iframe
//       and enable better controls (including fullscreen)
var actualCode = "if(typeof flowplayer != 'undefined') {setTimeout(function () {flowplayer().disableSubtitles()}, 8000)}";
var script = document.createElement('script');
script.textContent = actualCode;
(document.head||document.documentElement).appendChild(script);
