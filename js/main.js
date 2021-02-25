// const { formatters } = require("stylelint");

var $searchValues = document.querySelector('#search');
var xhr = new XMLHttpRequest();
var $entries = document.querySelector('.entries');
var timeout;
var $form = document.querySelector('form');
var $home = document.querySelector('.home');
var $searchResults = document.querySelector('.search-results');
var $row = document.querySelector('.row');

var $headerTitle = document.querySelector('.title');

$headerTitle.addEventListener('click', function () {
  $form.reset();
  reset();
  $home.className = 'home';
  $searchResults.className = 'search-results hidden';
});

$searchValues.addEventListener('keyup', function () {
  clearTimeout(timeout);
  reset();
  timeout = setTimeout(timeoutFunction, 500);
});

$form.addEventListener('submit', function () {
  event.preventDefault();
  $home.className = 'home hidden';
  $searchResults.className = 'search-results';
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
      loadSearch(data[i]);
    }
  } else {
    for (var j = 0; j < data.length; j++) {
      appendEntry(data[j]);
      loadSearch(data[j]);
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

function loadSearch(dataObject) {
  var $newCol = document.createElement('div');
  var $newImg = document.createElement('img');
  $newCol.setAttribute('class', 'col-half col-quarter');
  $newCol.appendChild($newImg);

  if (dataObject.images !== null) {
    $newImg.setAttribute('src', dataObject.images.web.url);
    $newImg.setAttribute('alt', dataObject.title);
  } else {
    $newImg.setAttribute('src', 'images/placeholder-image.jpg');
    $newImg.setAttribute('alt', dataObject.title);
  }

  $row.appendChild($newCol);
}

function reset() {
  removeAllChildNodes($row);
  removeAllChildNodes($entries);
}
