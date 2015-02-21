//jshint browser: true
window.addEventListener('load', function () {
  "use strict";
  var options = {
    server: this.location.toString(),
    ws: this.location.toString().replace(/^[^:]*/, 'ws')
  };
  document.querySelector('[data-options]').textContent = JSON.stringify(options, null, 4);
});
