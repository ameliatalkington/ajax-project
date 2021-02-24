var $searchValues = document.querySelector('#search');
var xhr = new XMLHttpRequest();
var $entries = document.querySelector('.entries');
var timeout;

$searchValues.addEventListener('keyup', function () {
  clearTimeout(timeout);
  removeAllChildNodes($entries);
  timeout = setTimeout(timeoutFunction, 500);
});

function timeoutFunction() {
  var data = $searchValues.value.split(' ').join('&');
  sendData(data);
}

function sendData(value) {
  xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://openaccess-api.clevelandart.org/api/artworks/?q=' + value);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    getFirst10Entries(xhr.response.data);
  });
  xhr.send();
}

function getFirst10Entries(data) {
  if (data.length >= 10) {
    for (var i = 0; i < 10; i++) {
      appendEntry(data[i]);
    }
  } else {
    for (var j = 0; j < data.length; j++) {
      appendEntry(data[j]);
    }
  }
}

function appendEntry(dataObject) {
  var $newSuggestion = document.createElement('div');
  var $h3 = document.createElement('h3');
  $newSuggestion.setAttribute('class', 'entry');
  var textContent = '';

  if (dataObject.title !== null) {
    textContent = dataObject.title;
  }
  if (dataObject.creators.length > 0) {
    textContent = textContent + ', ' + dataObject.creators[0].description;
  }
  if (dataObject.department !== null) {
    textContent = textContent + ', ' + dataObject.department;
  }

  $h3.textContent = textContent;

  $newSuggestion.appendChild($h3);
  $entries.appendChild($newSuggestion);
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
