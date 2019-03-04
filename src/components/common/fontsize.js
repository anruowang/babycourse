/**
 * Created by hgx on 2018/11/27.
 */
function htRem() {
  var ww = document.documentElement.clientWidth;
  document.documentElement.style.fontSize = ww / 3.75 + 'px';
}

htRem();
window.onresize = function() {
  htRem();
};

