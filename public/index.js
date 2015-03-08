//jshint browser: true
window.addEventListener('load', function () {
  "use strict";
  var serverUrl, options, list;
  serverUrl = this.location.toString();
  list = document.getElementById('handlers');
  /**
   * XHR wrapper
   *
   * @param {String}   url
   * @param {Function} callback
   *
   * @return undefined
   */
  function get(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', serverUrl + url, true);
    xhr.onload = function () {
      if (typeof cb === 'function') {
        cb(null, xhr);
      }
    };
    xhr.onerror = function (e) {
      var err = "Request failed : " + e.target.status;
      if (typeof cb === 'function') {
        cb(err, xhr);
      }
    };
    xhr.send();
  }
  function post(url, data, cb) {
    if (typeof data === 'object') {
      data = JSON.stringify(data);
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', serverUrl + url, true);
    xhr.onload = function () {
      if (typeof cb === 'function') {
        cb(null, xhr);
      }
    };
    xhr.onerror = function (e) {
      var err = "Request failed : " + e.target.status;
      if (typeof cb === 'function') {
        cb(err, xhr);
      }
    };
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(data);
  }

  function loadHandlers() {
    get('activity', function (err, res) {
      list.innerHTML = '';
      if (err) {
        console.error(err);
      } else {
        JSON.parse(res.responseText).forEach(function (handler) {
          var item;
          item = document.createElement('li');
          item.innerHTML = `${handler.fullname} - ${handler.href} - ${handler.name} <button data-action="unregister" data-value="${handler.href}">Unregister</button>`;// JSON.stringify(handler, null, 4);
          list.appendChild(item);
        });

      }
    });
  }

  function loadDebug() {
    get('activity/debug', function (err, res) {
      if (err) {
        console.error(err);
      } else {
        document.getElementById('debug').textContent = JSON.stringify(JSON.parse(res.responseText), null, 2);
      }
    });
  }

  function unregister(url) {
    var description = {
      href: url
    };
    post('activity/unregister', description, function (err, xhr) {
      var res;
      if (err) {
        window.alert("Error: " + err);
      } else {
        res = JSON.parse(xhr.response);
        if (res.result === 'ok') {
          loadHandlers();
          loadDebug();
          window.alert("Unregistration successful");
        } else {
          window.alert("Unknown error");
        }
      }
    });
  }

  list.addEventListener('click', function (e) {
    if (e.target.dataset.action) {
      switch (e.target.dataset.action) {
      case 'unregister':
        unregister(e.target.dataset.value);
        break;
      }
    }
  });

  loadHandlers();
  loadDebug();

  options = {
    server: serverUrl,
    ws: serverUrl.replace(/^[^:]*/, 'ws')
  };
  document.querySelector('[data-options]').textContent = JSON.stringify(options, null, 4);
});
