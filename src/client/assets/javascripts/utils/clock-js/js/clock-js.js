export function clockJs(idContainer) {
  var container = document.getElementById(idContainer);

  container.style.fontFamily = "alarm clock";
  container.style.textAnchor = "middle";

  function checkTime(t) {
    return t < 10 ? "0" + t : t;
  }

  var interval = setInterval(function() {
    if (container.offsetParent === null)
      clearInterval(interval);

    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var s = now.getSeconds();

    m = checkTime(m);
    s = checkTime(s);

    container.innerHTML = "<svg width='100%' height='100%' viewBox='0 0 55 13'><text x='50%' y='60%' alignment-baseline='middle' textLength='100%'>" + h + ":" + m + ":" + s + "</text></svg>";
  }, 200);
}
