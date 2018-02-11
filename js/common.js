 function defaultFontSize(){
  var d = window.document.createElement('div');
  d.style.width = '1rem';
  d.style.display = "none";
  var head = window.document.getElementsByTagName('head')[0];
  head.appendChild(d);
  var defaultFontSizeText = parseFloat(window.getComputedStyle(d, null).getPropertyValue('width'));
  d.remove();
  // console.log(defaultFontSizeText);
  return defaultFontSizeText;
}

var defaultFontSize = defaultFontSize();
// console.log(defaultFontSize);
function adoptdevice(designWidth, rem2px,defaultFontSizeText){
  var head = window.document.getElementsByTagName('head')[0];
  document.documentElement.style.fontSize = window.innerWidth / designWidth * rem2px / defaultFontSizeText * 100 + '%';
  var x=window.innerWidth / designWidth * rem2px / defaultFontSizeText * 100 + '%';
  var st = document.createElement('style');
  var portrait = "@media screen and (min-width: "+window.innerWidth+"px) {html{font-size:"+ x + "}}"
  var landscape = "@media screen and (min-width: "+window.innerHeight+"px) {html{font-size:"+ ((window.innerHeight/(designWidth/rem2px)/defaultFontSize)*100) +"%;}}"
  st.innerHTML = portrait;
  head.appendChild(st);
}
adoptdevice(750,100,defaultFontSize);
window.onresize = function(){
  adoptdevice(750,100,defaultFontSize);
}

