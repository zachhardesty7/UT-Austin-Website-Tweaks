// currently an error due to permissions to execute. check on content scripts
function addClass(){
  var classes = document.querySelectorAll("[data-th]");
  var uniqueID = classes.item(0); //.innerHTML
  var name = document.querySelector("#details h2")
  var time = classes.item(2);
  var para = document.createElement("p");
  var node = document.createTextNode(uniqueID + name + time);
  para.appendChild(node);
  var element = document.getElementById("classes");
  element.appendChild(para)
}
