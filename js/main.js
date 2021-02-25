// const { formatters } = require("stylelint");

var $searchValues = document.querySelector('#search');
var xhr = new XMLHttpRequest();
var $entries = document.querySelector('.entries');
var timeout;
var $form = document.querySelector('form');
var $home = document.querySelector('.home');
var $searchResults = document.querySelector('.search-results');
var $row = document.querySelector('.row');
var $entriesArray = $entries.childNodes;
var $imagesArray = $row.childNodes;
var $headerTitle = document.querySelector('.title');
var $selection = document.querySelector('.selection');
var $selectionContainer = document.querySelector('.selection-container');
var dataArray = [];

$row.addEventListener('click', function () {
  for (var n = 0; n < $imagesArray.length; n++) {
    if (event.target === $imagesArray[n].firstChild) {
      $searchResults.className = 'search-results hidden';
      $selection.className = 'selection';
      renderSelection(dataArray[n]);
    }
  }
});

$entries.addEventListener('click', function () {
  for (var v = 0; v < $entriesArray.length; v++) {
    if (event.target === $entriesArray[v].firstChild) {
      $home.className = 'home hidden';
      $selection.className = 'selection';
      renderSelection(dataArray[v]);
    }
  }
});

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
  dataArray = [];
  if (data.length >= 10) {
    for (var i = 0; i < 10; i++) {
      appendEntry(data[i]);
      loadSearch(data[i]);
      renderSelectionData(data[i]);
    }
  } else {
    for (var j = 0; j < data.length; j++) {
      appendEntry(data[j]);
      loadSearch(data[j]);
      renderSelectionData(data[j]);
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

function renderSelectionData(dataObject) {
  var newObject = {
    image: '',
    title: '',
    description: ''
  };
  newObject.image = dataObject.images.web.url;
  newObject.title = dataObject.title;
  newObject.description = dataObject.wall_description;
  dataArray.push(newObject);
}

function renderSelection(object) {
  var $newImg = document.createElement('img');
  var $title = document.createElement('h3');
  var $description = document.createElement('p');

  $newImg.setAttribute('src', object.image);
  $title.textContent = object.title;
  $description.textContent = object.description;

  $selectionContainer.appendChild($newImg);
  $selectionContainer.appendChild($title);
  $selectionContainer.appendChild($description);
}

function reset() {
  removeAllChildNodes($row);
  removeAllChildNodes($entries);
  removeAllChildNodes($selectionContainer);
}
