export function clockJs(containerDOM) {

  containerDOM.style.fontFamily = "alarm clock";
  containerDOM.style.textAnchor = "middle";

  function checkTime(t) {
    return t < 10 ? "0" + t : t;
  }

  var interval = setInterval(function() {
    if (containerDOM.offsetParent === null)
      clearInterval(interval);

    var now = new Date();
    var h = now.getHours();
    var m = checkTime(now.getMinutes());
    var s = checkTime(now.getSeconds());

    containerDOM.innerHTML = "<svg width='100%' height='100%' viewBox='0 0 55 13'><text x='50%' y='60%' alignment-baseline='middle' textLength='100%'>" + h + ":" + m + ":" + s + "</text></svg>";
  }, 200);
}
